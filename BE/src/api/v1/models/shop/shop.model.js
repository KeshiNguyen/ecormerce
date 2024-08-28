import mongoose from 'mongoose';

const {model, Schema} = mongoose;

const ShopSchema = new Schema({
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
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isValid: {
        type: Boolean,
        default: false,
        index: true,
        select: false
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
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export default model('Shop', ShopSchema)