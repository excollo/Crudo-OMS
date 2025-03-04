const nodemailer = require('nodemailer')
const { smtp } = require("../config/config");

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    host: smtp.host,
    port: smtp.port,
    auth: {
        user: smtp.user,
        pass: smtp.pass,
    },
})

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: `"Crudo Auth" <${smtp.user}>`,
        to,
        subject,
        text,
    }

    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendEmail
}