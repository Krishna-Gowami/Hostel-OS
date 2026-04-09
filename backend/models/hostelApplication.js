const mongoose = require('mongoose');

const hostelApplicationSchema = new mongoose.Schema({
  // Personal Details
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  category: { type: String, enum: ['general', 'obc', 'sc', 'st'], required: true },

  // Permanent Address (used for NCR validation)
  address: {
    line1: { type: String, required: true },
    line2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: { type: String, required: true },
    country: { type: String, default: 'India' }
  },

  // Academic Details
  jeePercentile: { type: Number, default: null },   // null = "NA"
  entranceMarks: { type: Number, default: null },    // null = "NA"
  hasJEE: { type: Boolean, default: false },
  hasEntrance: { type: Boolean, default: false },
  class10Percent: { type: Number },
  class12Percent: { type: Number },
  collegeName: { type: String, trim: true },
  course: { type: String, trim: true },
  yearOfStudy: { type: Number },

  // Other Details
  bloodGroup: { type: String, trim: true },
  medicalConditions: { type: String, default: '' },
  parentName: { type: String, required: true, trim: true },
  parentPhone: { type: String, required: true },
  parentEmail: { type: String, lowercase: true, trim: true, default: '' },

  // System fields
  eligible: { type: Boolean, default: true },  // false = NCR rejected (shouldn't be in DB, but just in case)
  status: {
    type: String,
    enum: ['pending', 'ranked', 'allocated', 'rejected'],
    default: 'pending'
  },
  allocationCategory: {
    type: String,
    enum: ['jee', 'entrance', null],
    default: null
  },
  applicationYear: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },

  // Geocoding result (for admin visibility)
  geocodedLat: { type: Number, default: null },
  geocodedLng: { type: Number, default: null },
  distanceFromNcrKm: { type: Number, default: null }
}, { timestamps: true });

// Compound index for year-based queries
hostelApplicationSchema.index({ applicationYear: 1, status: 1 });
hostelApplicationSchema.index({ email: 1, applicationYear: 1 }, { unique: true });

module.exports = mongoose.model('HostelApplication', hostelApplicationSchema);
