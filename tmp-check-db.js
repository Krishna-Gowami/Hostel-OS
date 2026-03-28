const mongoose = require('mongoose');
const User = require('./backend/models/db');
require('dotenv').config({ path: './backend/.env' });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await User.find({});
    console.log("Users in DB:", users.map(u => ({ email: u.email, role: u.role, password: u.password })));
    process.exit(0);
  })
  .catch(err => {
    console.error("DB Error:", err);
    process.exit(1);
  });
