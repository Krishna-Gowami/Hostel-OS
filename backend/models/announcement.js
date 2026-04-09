const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  audience: { type: String, enum: ['all', 'student', 'staff'], default: 'all' },
  targetBuilding: { type: String, default: null },
  priority: { type: String, enum: ['normal', 'urgent', 'info'], default: 'normal' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
