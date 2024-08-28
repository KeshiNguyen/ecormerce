import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config()

const { EMAIL_USER, EMAIL_PASS, APP_URL } = process.env;

let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});
const sendMailOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Email OTP',
            text: `Your OTP code is ${otp}`
        };
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("Error sending email via Gmail:", error);
        throw error;
    }
};

export default sendMailOTP