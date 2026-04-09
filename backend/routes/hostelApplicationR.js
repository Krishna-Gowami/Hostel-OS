// backend/routes/hostelApplicationR.js
const express = require('express');
const router = express.Router();
const HostelApplication = require('../models/hostelApplication');
const HostelConfig = require('../models/hostelConfig');
const { auth, authorize } = require('../middleware/authmiddleware');
const { validateNCR } = require('../services/ncrValidationService');
const emailService = require('../services/emailService');
const User = require('../models/db');

// ─── GET /api/hostel-config ───────────────────────────────────────────
// Get or create current year's config
router.get('/config', auth, authorize('admin'), async (req, res) => {
  try {
    const year = parseInt(process.env.APPLICATION_YEAR || new Date().getFullYear());
    let config = await HostelConfig.findOne({ applicationYear: year });
    if (!config) {
      config = await HostelConfig.create({ applicationYear: year });
    }
    res.json({ success: true, config });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── PUT /api/hostel-applications/config ─────────────────────────────
router.put('/config', auth, authorize('admin'), async (req, res) => {
  try {
    const year = parseInt(process.env.APPLICATION_YEAR || new Date().getFullYear());
    const { totalSeats, genderRatioMale, applicationDeadline } = req.body;

    const updates = {};
    if (totalSeats !== undefined) updates.totalSeats = parseInt(totalSeats);
    if (genderRatioMale !== undefined) updates.genderRatioMale = parseFloat(genderRatioMale);
    if (applicationDeadline !== undefined) updates.applicationDeadline = new Date(applicationDeadline);

    const config = await HostelConfig.findOneAndUpdate(
      { applicationYear: year },
      updates,
      { new: true, upsert: true }
    );
    res.json({ success: true, config });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── GET /api/hostel-applications ────────────────────────────────────
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const year = parseInt(process.env.APPLICATION_YEAR || new Date().getFullYear());
    const { status, search, page = 1, limit = 20 } = req.query;

    const filter = { applicationYear: year };
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [applications, total] = await Promise.all([
      HostelApplication.find(filter).sort({ submittedAt: -1 }).skip(skip).limit(parseInt(limit)),
      HostelApplication.countDocuments(filter)
    ]);

    res.json({
      success: true,
      applications,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── GET /api/hostel-applications/:id ────────────────────────────────
router.get('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const app = await HostelApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/hostel-applications/submit ────────────────────────────
// PUBLIC — no auth required
router.post('/submit', async (req, res) => {
  try {
    const {
      name, email, phone, dob, gender, category,
      address,
      jeePercentile, entranceMarks,
      class10Percent, class12Percent,
      collegeName, course, yearOfStudy,
      bloodGroup, medicalConditions,
      parentName, parentPhone, parentEmail
    } = req.body;

    const year = parseInt(process.env.APPLICATION_YEAR || new Date().getFullYear());

    // ── Duplicate check ──
    const existing = await HostelApplication.findOne({ email: email.toLowerCase(), applicationYear: year });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An application with this email already exists for this year.'
      });
    }

    // ── Parse JEE / Entrance ──
    const jeeParsed = (jeePercentile === 'NA' || jeePercentile === '' || jeePercentile === null || jeePercentile === undefined)
      ? null : parseFloat(jeePercentile);
    const entranceParsed = (entranceMarks === 'NA' || entranceMarks === '' || entranceMarks === null || entranceMarks === undefined)
      ? null : parseFloat(entranceMarks);

    if (jeeParsed === null && entranceParsed === null) {
      return res.status(400).json({
        success: false,
        message: 'At least one of JEE Percentile or College Entrance Marks must be provided (not NA).'
      });
    }

    // ── NCR Validation (API-based) ──
    console.log(`🔍 Running NCR validation for: ${name} (${email})`);
    const ncrResult = await validateNCR(address);

    // Save to DB (whether eligible or not, we do not block submission)
    const application = new HostelApplication({
      name, email: email.toLowerCase(), phone, dob, gender, category,
      address,
      jeePercentile: jeeParsed,
      entranceMarks: entranceParsed,
      hasJEE: jeeParsed !== null,
      hasEntrance: entranceParsed !== null,
      class10Percent: class10Percent ? parseFloat(class10Percent) : undefined,
      class12Percent: class12Percent ? parseFloat(class12Percent) : undefined,
      collegeName, course, yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : undefined,
      bloodGroup, medicalConditions,
      parentName, parentPhone, parentEmail,
      eligible: ncrResult.eligible,        // Record if they pass eligibility
      status: ncrResult.eligible ? 'pending' : 'rejected', // Internal categorization
      applicationYear: year,
      geocodedLat: ncrResult.lat,
      geocodedLng: ncrResult.lng,
      distanceFromNcrKm: ncrResult.distanceKm
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully! You will be notified via email regarding the process.',
      applicationId: application._id
    });
  } catch (err) {
    console.error('❌ Hostel application submit error:', err.message);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'An application with this email already exists for this year.' });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─── POST /api/hostel-applications/:id/allocate ───────────────────────
router.post('/:id/allocate', auth, authorize('admin'), async (req, res) => {
  try {
    const year = parseInt(process.env.APPLICATION_YEAR || new Date().getFullYear());
    const config = await HostelConfig.findOne({ applicationYear: year });
    if (config?.isFinalized) return res.status(400).json({ success: false, message: 'Process is completely finalized. Cannot alter allocations.' });

    const app = await HostelApplication.findByIdAndUpdate(req.params.id, { status: 'allocated' }, { new: true });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/hostel-applications/:id/unallocate ─────────────────────
router.post('/:id/unallocate', auth, authorize('admin'), async (req, res) => {
  try {
    const year = parseInt(process.env.APPLICATION_YEAR || new Date().getFullYear());
    const config = await HostelConfig.findOne({ applicationYear: year });
    if (config?.isFinalized) return res.status(400).json({ success: false, message: 'Process is completely finalized. Cannot alter allocations.' });

    const targetApp = await HostelApplication.findById(req.params.id);
    if (!targetApp) return res.status(404).json({ success: false, message: 'Application not found' });
    
    targetApp.status = targetApp.eligible ? 'pending' : 'rejected';
    await targetApp.save();
    
    res.json({ success: true, application: targetApp });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/hostel-applications/finalize ─────────────────────────
router.post('/finalize', auth, authorize('admin'), async (req, res) => {
  try {
    const year = parseInt(process.env.APPLICATION_YEAR || new Date().getFullYear());
    let config = await HostelConfig.findOne({ applicationYear: year });
    if (!config) return res.status(400).json({ success: false, message: 'No config found' });
    
    if (config.isFinalized) return res.status(400).json({ success: false, message: 'Already finalized' });

    config.isFinalized = true;
    await config.save();
    res.json({ success: true, message: 'Process finalized. You can now send notifications.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/hostel-applications/send-notifications ─────────────────
router.post('/send-notifications', auth, authorize('admin'), async (req, res) => {
  try {
    const year = parseInt(process.env.APPLICATION_YEAR || new Date().getFullYear());
    const config = await HostelConfig.findOne({ applicationYear: year });
    
    if (!config || !config.isFinalized) {
      return res.status(400).json({ success: false, message: 'Must finalize the allocation phase before sending notifications.' });
    }

    const { selectionEmailTemplate, rejectionEmailTemplate } = config;

    const allApps = await HostelApplication.find({ applicationYear: year });
    
    let emailsSent = 0;
    
    for (const app of allApps) {
      if (app.status === 'allocated') {
        emailService.sendHostelAllocationEmail(app.email, app.name, app.allocationCategory, selectionEmailTemplate).catch(console.error);
        
        // Ensure student User account is created so they can actually log in
        const existingUser = await User.findOne({ email: app.email.toLowerCase() });
        if (!existingUser) {
          const newUser = new User({
            name: app.name,
            email: app.email.toLowerCase(),
            phoneNumber: app.phone,
            password: app.email.toLowerCase(), // Requested spec: registered email as password
            role: 'student'
          });
          await newUser.save().catch(e => console.error('Error creating user account:', e.message));
        }
      } else {
        emailService.sendHostelRejectionEmail(app.email, app.name, rejectionEmailTemplate).catch(console.error);
      }
      emailsSent++;
    }

    res.json({ success: true, message: `Successfully requested to send ${emailsSent} notifications.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
