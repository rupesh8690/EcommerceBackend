const nodemailer = require("nodemailer");

// sendEmail function accepts an object with email, subject, and message
async function sendEmail({ email, subject, message }) {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail", // you can change to any email service
            auth: {
                user: process.env.EMAIL_USER,  // your email
                pass: process.env.EMAIL_PASS   // your app password
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: message
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return info;

    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent");
    }
}

module.exports = sendEmail;

