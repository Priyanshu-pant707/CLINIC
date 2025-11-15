const clinicModel = require("../models/Clinic");
const bcrypt = require("bcrypt");
const userModel = require("../models/user")
const appointmentModel = require("../models/appointment");
const sendMail = require("../utils/sendMail");
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, qualifications } = req.body;
        const clinicAdminId = req.user.id;

        const clinic = await clinicModel.findOne({ clinicAdmins: clinicAdminId });
        if (!clinic) {
            return res.status(403).json({ message: "No clinic found for this admin" });

        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const doctor = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: "doctor",
            clinic: clinic._id,
            doctorInfo: {
                specialization,
                experience,
                qualifications,
            }
        });


        clinic.doctors.push(doctor._id);
        await clinic.save();

        res.status(201).json({
            message: "Doctor Added successfully", doctor
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }


}

const addPatient = async (req, res) => {
    try {
        const { name, email, password, age, gender, contact } = req.body;
        const clinicAdminId = req.user.id;

        const clinic = await clinicModel.findOne({ clinicAdmins: clinicAdminId });

        if (!clinic) {
            return res.status(403).json({ message: "no clinic found for this admin" });


        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const patient = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: "patient",
            clinic: clinic._id,
            patientInfo: {
                age,
                gender,
                contact,
            }
        });

        clinic.patients.push(patient._id);
        await clinic.save();

        res.status(201).json({ message: "Pateint added successfully", patient });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const showDoctor = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;


        // find the clinic with the doctor details

        const clinic = await clinicModel.findById(clinicId).populate("doctors", "name email role doctorInfo");

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found"
            });
        }

        return res.status(200).json({
            message: "List of all docotrs in the clinic",
            doctors: clinic.doctors,
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching doctor", error: error.message });
    }
}

const showPatient = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;
        const clinic = await clinicModel.findById(clinicId).populate("patients", "name email role patientInfo");

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found"
            });
        }

        return res.status(200).json({
            message: "List of all patients in  this clinic",
            patients: clinic.patients,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching patients", error: error.message });
    }
}




// clinic admin - can create appointment ofr any patient and doctor

const adminCreateAppointment = async (req, res) => {
    try {
        const adminId = req.user.id;
        const clinicId = req.user.clinicId;
        const adminRole = req.user.role;

        // only clinic admin can access this

        const findAdmin =await userModel.findById(adminId);

        if (!findAdmin || findAdmin.role!=="clinicadmin") {
            return res.status(403).json({
                success: false,
                message: "Only clinic admin can create appointments"
            });
        }


        const doctorId = req.params.id;

        // hum ek form denge jisme ki patient ki list hogi ,  from there we can access the patient id ,date,time and notes will provide a text holder , in future an ai response generator.
        const { patientId, date, time, notes } = req.body;

        // validate the doctor

        const doctor = await userModel.findById(doctorId);

        if (!doctor || doctor.role !== "doctor") {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }


        // validate the patient hai ki nhi

        const patient = await userModel.findById(patientId);
        if (!patient || patient.role !== "patient") {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }


        // formality checking - be in safer side

        if (String(doctor.clinic) !== String(clinicId)) {
            return res.status(400).json({
                success: false,
                message: "This doctor is not part of your clinic"
            });
        }

        //  ab double booking bhi check kr lete h

        const existing = await appointmentModel.findOne({
            doctorId,
            date,
            time
        });


        if (existing) {
            return res.status(400).json({
                success: false,
                message: "This time slot is already booked"
            });
        }


        // 5. Create appointment 

        const appointment = await appointmentModel.create({
            clinicId,
            doctorId,
            patientId,
            date,
            time,
            notes,
            status: "approved"  // jb admin bna rha h toh auto approved hogi....
        })



        // doctor ke liye mail 
      const doctorMailHTML = `
            <div style="font-family: Arial;">
                <h2>New Appointment Assigned</h2>
                <p>Dear Dr. ${doctor.name},</p>
                <p>You have a new appointment scheduled.</p>
                <ul>
                    <li><b>Patient:</b> ${patient.name}</li>
                    <li><b>Date:</b> ${date}</li>
                    <li><b>Time:</b> ${time}</li>
                    <li><b>Notes:</b> ${notes || "N/A"}</li>
                </ul>
                <br>
                <p>Regards,<br>MultiClinic Team</p>
            </div>
        `;
// aur ab  patient ke liye mail 
        const patientMailHTML = `
            <div style="font-family: Arial;">
                <h2>Appointment Confirmed</h2>
                <p>Dear ${patient.name},</p>
                <p>Your appointment has been scheduled with:</p>
                <ul>
                    <li><b>Doctor:</b> Dr. ${doctor.name}</li>
                    <li><b>Date:</b> ${date}</li>
                    <li><b>Time:</b> ${time}</li>
                    <li><b>Notes:</b> ${notes || "N/A"}</li>
                </ul>
                <br>
                <p>Regards,<br>MultiClinic Team</p>
            </div>
        `;


        // send mail to doctor and the pateint

        await sendMail(doctor.email,"New Appointment Assigned",doctorMailHTML);
        await sendMail(patient.email,"Your Appointment is Confirmed",patientMailHTML);

        return res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            data: appointment
        })



    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: err.message
        });

    }
};





module.exports = {
    addDoctor,
    addPatient,
    showDoctor,
    showPatient,
    adminCreateAppointment

}