

//const clinicModel = require("../.models/clinic");


const clinicModel = require("../.models/clinic");
const userModel = require("../.models/user");

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


        // check if the clinic already exits

        const existingClinic = await clinicModel.findOne({ name });
        if (existingClinic) {
            return res.status(400).json({
                message: "Clinic Already exisits"
            });
        }

        // create clinic admin

        const hashedPassword = await bcrypt.hash(adminPassword, process.env.SALT);

        const clinicAdmin = await userModel.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "clinicadmin"
        });


        //  create clinic

        const clinic = await clinicModel.create({
            name,
            location,
            description,
            createdBy,
            clinicAdmins: [clinicAdmin._id]
        });

        // link admin to clinic
        clinicAdmin.clinic = clinic._id;
        await clinicAdmin.save();


        res.status(201).json({
            message: "Clinic & clinic Admin created successfully", clinic,
            admin: clinicAdmin
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


const deleteClinic = (req, res) => {
    res.send("hello from the deleting particular clinic");
}

module.exports = {
    addClinicWithAdmin ,
    deleteClinic,
    getAllClinics
}