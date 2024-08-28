import mongoose from 'mongoose';

const {model, Schema} = mongoose;

const UserSchemas = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
    },
    mobie: {
        type: String,
        sparse: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: [String],
        enum: ['customer', 'admin', 'shop'],
        default: ['customer'],
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export default model('User', UserSchemas)