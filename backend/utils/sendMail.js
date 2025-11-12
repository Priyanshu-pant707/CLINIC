const nodemailer = require("nodemailer");


require("dotenv").config();


const sendMail = async (to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            secure: true,
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.nodeMailerPassword,
            },

        });

        const mailOptions = {
            from: `"MultiClinic System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log("Mail sent to", to);
    } catch (err) {
        console.error("Error sending mail",error);
    }
};

module.exports =sendMail;