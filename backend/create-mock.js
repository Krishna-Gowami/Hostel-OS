const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Payment = require('./models/payment');
const User = require('./models/db');
const Room = require('./models/room');
dotenv.config();

const docSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ['rules', 'finance', 'policy', 'mess', 'emergency', 'forms', 'other'], default: 'other' },
  fileType: String,
  fileName: String,
  filePath: String,
  fileSize: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  downloads: { type: Number, default: 0 },
}, { timestamps: true })

const Document = mongoose.models.Document || mongoose.model('Document', docSchema)

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shms').then(async () => {
  console.log('Connected to DB');

  // Find users
  const adminUser = await User.findOne({ role: 'admin' });
  const testStudent = await User.findOne({ email: 'teststudent@gmail.com' }) || await User.findOne({ role: 'student' });
  
  if (!adminUser || !testStudent) {
      console.log('Admin or test student missing');
      process.exit();
  }
  
  // 1. Add mock documents drafted by Admin
  const docExists = await Document.findOne({ title: 'Hostel Rules & Regulations 2026' });
  if (!docExists) {
      await Document.insertMany([
        { title: 'Hostel Rules & Regulations 2026', category: 'rules', fileType: 'PDF', fileName: 'rules.pdf', filePath: 'uploads/documents/rules.pdf', fileSize: '2.40 MB', uploadedBy: adminUser._id },
        { title: 'Emergency Protocols', category: 'emergency', fileType: 'PDF', fileName: 'emergency.pdf', filePath: 'uploads/documents/emergency.pdf', fileSize: '1.10 MB', uploadedBy: adminUser._id },
        { title: 'Mess Menu Schedule', category: 'mess', fileType: 'PDF', fileName: 'mess.pdf', filePath: 'uploads/documents/mess.pdf', fileSize: '0.80 MB', uploadedBy: adminUser._id }
      ]);
      console.log('Mock documents added');
  } else {
      console.log('Mock documents already exist');
  }

  // 2. Add mock revenue data for the teststudent across a few months
  console.log(`Adding revenue data for student: ${testStudent.email}`);
  
  const room = await Room.findOne();
  
  const statuses = ['completed', 'completed', 'completed', 'completed', 'pending'];
  const amounts = [12000, 12000, 12000, 12000, 12000];
  
  const payments = [];
  const now = new Date();
  
  for (let i = 0; i < 5; i++) {
     const pDate = new Date(now.getFullYear(), now.getMonth() - i, 15); // middle of month
     payments.push({
         user: testStudent._id,
         room: room ? room._id : null,
         amount: amounts[i],
         finalAmount: amounts[i],
         paymentType: 'monthly_rent',
         status: statuses[i],
         dueDate: new Date(now.getFullYear(), now.getMonth() - i, 5),      // Dues were 5th of that month
         createdAt: pDate,
         updatedAt: pDate,
         transactionId: statuses[i] === 'completed' ? `TXN-MOCK-${Date.now()}-${i}` : null
     });
  }
  
  await Payment.deleteMany({ transactionId: { $regex: 'TXN-MOCK' } });
  await Payment.insertMany(payments);
  console.log('Mock payments added successfully');
  
  process.exit();
}).catch(e => {
    console.error(e);
    process.exit(1);
});
