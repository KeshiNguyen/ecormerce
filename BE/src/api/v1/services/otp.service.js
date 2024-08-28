import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';

import OTP from '../models/index.model.js';

import sendSMSOTP from '../utils/sendSMS/sendSMSOTP_TWILIO.js';

'use strict'
class OTPService {

    static sendOTP = async (number) => {
        try {
            //generate otp
            const otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
    
            console.log(`OTP is:: `, otp);

            await generateOTP(otp, number);
            const result = await sendSMSOTP(number, otp);
            console.log(`result:: `, result)
        } catch (error) {
            console.error(error);
        }
    }
    static generateOTP = async (otp, number) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashOtp = await bcrypt.hash(otp, salt);
            const newOtp = await OTP.create({
                number: number,
                otp: hashOtp
            })

            return newOtp ? 1 : 0;
        } catch (error) {
            console.error(error)
        }
    }

    static verifyOTP = async (otp, number) => {
        try {
            const otpRecord = await OTP.findOne({number: number});
            if(!otpRecord) {
                return {
                    status: 'error',
                    message: 'Invalid OTP or OTP expired',
                }
            };
            const isMatch = await bcrypt.compare(otp, otpRecord.otp);
            if(!isMatch) {
                return {
                    status: 'error',
                    message: 'Invalid OTP or OTP expired'
                }
            }
            return {
                status:'success',
                message: 'OTP verified successfully'
            }
        } catch (error) {
            console.error(error)
        }
    }

    static sendMailOTP = async (email) => {
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        console.log(`OTP is:: `, otp);
    }
}

export default OTPService