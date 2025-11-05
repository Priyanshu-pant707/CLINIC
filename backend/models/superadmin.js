const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
require("dotenv").config();

const addSuperAdmin = async () => {
  try {
    // Pehle check kar lo koi superadmin hai ya nahi
    const existingAdmin = await userModel.findOne({ role: "superadmin" });

    if (existingAdmin) {
      console.log(" Super Admin already exists!");
      return;
    }

    const password =process.env.SuperAdminPassword ;
    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await userModel.create({
      name: "Priyanshu Pant",
      email: "pantpriyanshu707@gmail.com",
      password: hashedPassword,
      role: "superadmin",
    });

    console.log(" Super Admin created successfully!");
  } catch (err) {
    console.error("Error creating super admin:", err.message);
  }
};

module.exports = addSuperAdmin;
