const mongoose = require('mongoose');

const hostelConfigSchema = new mongoose.Schema({
  applicationYear: { type: Number, required: true, unique: true },
  totalSeats: { type: Number, default: 100 },
  genderRatioMale: { type: Number, default: 0.6, min: 0, max: 1 },  // e.g. 0.6 = 60% male
  applicationDeadline: { type: Date, default: null },  // admin sets this
  isFinalized: { type: Boolean, default: false },
  rejectionEmailTemplate: { type: String, default: 'Your application for hostel accommodation has been reviewed. Unfortunately, you have not been selected for room allocation at this time.' },
  selectionEmailTemplate: { type: String, default: 'Congratulations! Your hostel application has been approved. Below are your login credentials for the portal:' },
}, { timestamps: true });

module.exports = mongoose.model('HostelConfig', hostelConfigSchema);
