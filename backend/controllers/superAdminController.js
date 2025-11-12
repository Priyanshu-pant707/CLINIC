
const clinicModel = require("../models/Clinic");
const userModel = require("../models/user");

const bcrypt = require("bcrypt");

require("dotenv").config();

// nodemailer functions

const sendMail = require("../utils/sendMail");



// controllers 


const getAllClinics = async (req, res) => {

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



    //send email to clinic admin 

    // 📨 Send email to clinic admin
    const mailHTML = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to MultiClinic System, ${adminName}!</h2>
        <p>Your clinic <b>${name}</b> has been successfully registered.</p>
        <p><b>Login Details:</b></p>
        <ul>
          <li>Email: ${adminEmail}</li>
          <li>Password: ${adminPassword}</li>
        </ul>
        <p>Please login and change your password after first login.</p>
        <br/>
        <p>Best regards,<br/>MultiClinic Team</p>
      </div>
    `;
    await sendMail(adminEmail, "Welcome to MultiClinic System!", mailHTML);








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



const deleteClinic = async (req, res) => {
  try {
    const clinicId = req.params.id;

    // clinic check kro , if exists or not
    const clinic = await clinicModel.findById(clinicId);

    // check if exists
    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Sorry! clinic not found"
      });
    }


    // delete all the clinic admins of this clinic , and they will be deleted as well as from the usermodel 

    await userModel.deleteMany({ clinic: clinicId, role: "clinicadmin" });

    // now same for the doctors

    await userModel.deleteMany({ clinic: clinicId, role: "doctor" });


    // now we cant delete the patient as he/she can get to the part of another clinic as well

    await userModel.updateMany({ clinic: clinicId, role: "patient" },
      { $unset: { clinic: "" } }
    )

    // now delete the clinic itself

    await clinicModel.findByIdAndDelete(clinicId);


    return res.status(200).json({
      message: "Clinic, its admins and doctors deleted successfully. Patients unlinked.",
    });

  } catch (err) {
    console.error("Error deleting clinic :", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};



const findClinicById = async (req, res) => {
  try {
    const clinicId = req.params.id;
    const clinic = await clinicModel.findById(clinicId);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "No clinic found !"
      });
    }

    res.status(200).json({
      success: true,
      message: "clinic found ",
      data: clinic
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })
  }
}

module.exports = {
  addClinicWithAdmin,
  deleteClinic,
  getAllClinics,
  findClinicById
}