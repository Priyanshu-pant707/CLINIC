
const clinicModel = require("../models/Clinic");
const userModel = require("../models/user");

const bcrypt=require("bcrypt");

const getAllClinics = async (req, res) => {

    require("dotenv").config();
    // getting all the clinic details
    const allclinicInfo = await clinicModel.find();

    // sending to the frontend 
    res.send(allclinicInfo);

}





//  creating clinic with the admin
const addClinicWithAdmin = async (req, res) => {
  try {
    const { name, location, description, adminName, adminEmail, adminPassword } = req.body;
    const createdBy = req.user.id;

    // Step 1: Check if clinic exists
    const existingClinic = await clinicModel.findOne({ name });
    if (existingClinic) {
      return res.status(400).json({ message: "Clinic already exists" });
    }

    // Step 2: Check if admin email already exists
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      return res.status(400).json({ message: "Clinic admin with this email already exists" });
    }

    // Step 3: Hash password safely
    const saltRounds = Number(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Step 4: Create admin
    const clinicAdmin = await userModel.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "clinicadmin",
    });

    // Step 5: Create clinic
    const clinic = await clinicModel.create({
      name,
      location,
      description,
      createdBy,
      clinicAdmins: [clinicAdmin._id],
    });

    // Step 6: Link admin to clinic
    clinicAdmin.clinic = clinic._id;
    await clinicAdmin.save();

    // Step 7: Only send response once everything is done
    return res.status(201).json({
      message: "Clinic & clinic admin created successfully",
      clinic,
      admin: clinicAdmin,
    });
  } catch (err) {
    console.error("Error in addClinicWithAdmin:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};



const deleteClinic = (req, res) => {
    res.send("hello from the deleting particular clinic");
}

module.exports = {
    addClinicWithAdmin ,
    deleteClinic,
    getAllClinics
}