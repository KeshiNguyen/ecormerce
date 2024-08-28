import twilio from 'twilio';

import appConfig from '../../../../configs/app.config.js';

const TWILIO_ACCOUNT_SID = appConfig.twilio.accountSid;
const TWILIO_AUTH_TOKEN = appConfig.twilio.authToken;
const TWILIO_PHONE_NUMBER = appConfig.twilio.phoneNumber;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// const sendSMSOTP = async (toPhoneNumber) => {
//     try {
//         const otp = Math.random().toString().substring(2, 8);
//         const message = await client.messages.create({
//             body: `Your OTP code is ${otp}`,
//             from: process.env.TWILIO_PHONE_NUMBER,
//             to: toPhoneNumber
//         });
//         return message;
//     } catch (error) {
//         console.error("Error sending SMS via Twilio:", error);
//         throw error;
//     }
// };

// (async () => {
//     try {
//         const toPhoneNumber = '+84347868408'; // Số điện thoại nhận OTP
//         const result = await sendSMSOTP(toPhoneNumber);
//         console.log("SMS sent successfully:", result);
//     } catch (error) {
//         console.error("Failed to send SMS OTP:", error);
//     }
// })();

export const sendSMSOTP = async (otp, toPhoneNumber) => {
  const message = client.messages
    .create({
      body: `Your OTP code is ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: toPhoneNumber
    })
    .then(message => {
      console.log("SMS sent successfully:", message.sid);
    })
    .catch(error => {
      console.error("Failed to send SMS OTP:", error);
    });
}
