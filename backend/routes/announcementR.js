const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { auth, authorize } = require('../middleware/authmiddleware')

const Announcement = require('../models/announcement')
const User = require('../models/db')

// GET /api/announcements — list all (paginated) and filtered by role/building
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    
    // Filter logic
    let filter = {
      $or: [
        { audience: 'all' },
        { audience: req.user.role === 'admin' || req.user.role === 'warden' || req.user.role === 'staff' ? 'staff' : 'student' }
      ]
    };
    
    // If student, also check building if applicable
    if (req.user.role === 'student' && req.user.room) {
      const room = await mongoose.model('Room').findById(req.user.room);
      if (room && room.building) {
         filter.$or.push({ audience: 'student', targetBuilding: room.building });
      }
    }

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    const total = await Announcement.countDocuments(filter)
    res.json({ success: true, announcements, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// POST /api/announcements/mark-read
router.post('/mark-read', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { hasUnreadAnnouncements: false })
    res.json({ success: true, message: 'Notifications marked as read' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// POST /api/announcements — create (admin/warden only)
router.post('/', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { title, message, audience, priority, targetBuilding } = req.body
    if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message required' })
    
    // Default mapped audience if coming from old UI value
    let mappedAudience = audience === 'All Residents' ? 'all' : audience;
    
    const ann = await Announcement.create({ title, message, audience: mappedAudience, targetBuilding, priority, createdBy: req.user._id })
    await ann.populate('createdBy', 'name role')
    
    // Set unread flag for target audience
    let userFilter = {};
    if (mappedAudience === 'student') {
        userFilter.role = 'student';
        if (targetBuilding) {
           // We need to find students in this building.
           // Since users reference a room, we first find rooms in the building.
           const roomsInBuilding = await mongoose.model('Room').find({ building: targetBuilding }).select('_id');
           const roomIds = roomsInBuilding.map(r => r._id);
           userFilter.room = { $in: roomIds };
        }
    } else if (mappedAudience === 'staff') {
        userFilter.role = { $in: ['staff', 'warden'] };
    }
    await User.updateMany(userFilter, { hasUnreadAnnouncements: true });

    res.status(201).json({ success: true, announcement: ann })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// DELETE /api/announcements/:id
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

module.exports = router
