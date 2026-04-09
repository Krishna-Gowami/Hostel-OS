// backend/services/ncrValidationService.js
// NCR Proximity Validation using Nominatim (primary) + OpenCage (fallback)
// Nominatim rate limit: 1 req/sec — respect this in batch operations

const https = require('https');
const http = require('http');

// ─── Haversine Formula ───────────────────────────────────────────────
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// ─── HTTP Fetch Helper (no axios dependency) ──────────────────────────
function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const options = { headers };
    lib.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Failed to parse response: ' + data.substring(0, 200))); }
      });
    }).on('error', reject);
  });
}

// ─── Nominatim Geocoding ──────────────────────────────────────────────
async function geocodeWithNominatim(address) {
  try {
    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=in`;
    const headers = {
      'User-Agent': 'HostelOS/1.0 (hostel management system)',
      'Accept': 'application/json'
    };
    const results = await fetchUrl(url, headers);
    if (results && results.length > 0) {
      return {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon),
        displayName: results[0].display_name,
        source: 'nominatim'
      };
    }
    return null;
  } catch (err) {
    console.error('Nominatim geocoding failed:', err.message);
    return null;
  }
}

// ─── OpenCage Fallback Geocoding ──────────────────────────────────────
async function geocodeWithOpenCage(address) {
  const apiKey = process.env.OPENCAGE_API_KEY;
  if (!apiKey) {
    console.warn('OPENCAGE_API_KEY not set — skipping fallback');
    return null;
  }
  try {
    const query = encodeURIComponent(address);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}&limit=1&countrycode=in`;
    const results = await fetchUrl(url);
    if (results?.results?.length > 0) {
      const geo = results.results[0].geometry;
      return {
        lat: geo.lat,
        lng: geo.lng,
        displayName: results.results[0].formatted,
        source: 'opencage'
      };
    }
    return null;
  } catch (err) {
    console.error('OpenCage geocoding failed:', err.message);
    return null;
  }
}

// ─── Main Geocoder (Nominatim → OpenCage fallback) ────────────────────
async function geocodeAddress(address) {
  let result = await geocodeWithNominatim(address);
  if (!result) {
    console.log('Nominatim returned no results, trying OpenCage fallback...');
    result = await geocodeWithOpenCage(address);
  }
  return result;
}

// ─── Build Address String from Object ────────────────────────────────
function buildAddressString(address) {
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pin,
    address.country || 'India'
  ].filter(Boolean);
  return parts.join(', ');
}

// ─── Main NCR Validation Function ─────────────────────────────────────
// Returns: { eligible: Boolean, lat, lng, distanceKm, reason, source }
async function validateNCR(address) {
  const NCR_LAT = parseFloat(process.env.NCR_CENTER_LAT || '28.6139');
  const NCR_LNG = parseFloat(process.env.NCR_CENTER_LNG || '77.2090');
  const NCR_RADIUS = parseFloat(process.env.NCR_RADIUS_KM || '25');

  const addressString = buildAddressString(address);
  console.log(`🌍 Geocoding address: "${addressString}"`);

  const geoResult = await geocodeAddress(addressString);

  if (!geoResult) {
    // Cannot verify — treat as INELIGIBLE for safety
    return {
      eligible: false,
      lat: null,
      lng: null,
      distanceKm: null,
      reason: 'Could not verify address location. Please check your permanent address and resubmit.',
      source: 'none'
    };
  }

  const distanceKm = haversineDistance(geoResult.lat, geoResult.lng, NCR_LAT, NCR_LNG);
  const isInsideNCR = distanceKm <= NCR_RADIUS;

  console.log(`📍 Geocoded to: ${geoResult.lat}, ${geoResult.lng} (${geoResult.displayName})`);
  console.log(`📏 Distance from NCR center: ${distanceKm.toFixed(2)} km (limit: ${NCR_RADIUS} km)`);
  console.log(`✅ Eligible: ${!isInsideNCR}`);

  return {
    eligible: !isInsideNCR,
    lat: geoResult.lat,
    lng: geoResult.lng,
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    reason: isInsideNCR
      ? `Your permanent address (${geoResult.displayName}) is within ${distanceKm.toFixed(1)} km of NCR. Students residing within 25 km of NCR are not eligible for hostel accommodation.`
      : null,
    source: geoResult.source
  };
}

module.exports = { validateNCR, haversineDistance, geocodeAddress };
