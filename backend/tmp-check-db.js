const mongoose = require('mongoose');
const User = require('./models/db');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/shms")
  .then(async () => {
    const users = await User.find({});
    console.log("Users in DB:", users.map(u => ({ email: u.email, role: u.role, password: u.password })));
    process.exit(0);
  })
  .catch(err => {
    console.error("DB Error:", err);
    process.exit(1);
  });
