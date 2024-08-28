import { model, Schema } from 'mongoose';

export const otpType = {
    EMAIL: 'EMAIL',
    PHONE: 'PHONE',
};

const otpSchema = new Schema({
    recipient: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                if(otpType.email === value ) {
                    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return emailRegex.test(value);
                } else if (otpType.PHONE === value) {
                    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
                    return regexPhoneNumber.test(value);
                } else {
                    return false;
                }
            },
            message: (props) => `Invalid ${props.value} format. Please enter a valid email or phone number.`,
        }
    },
    otp: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now,
        index: {expires: 300}//after 5 minutes it deleted automatic from database
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export default model('Otp', otpSchema)