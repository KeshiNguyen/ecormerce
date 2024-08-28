'use strict'
import { model, Schema } from 'mongoose';

const InfoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: {
        country: {
            type: String,
        },
        city: {
            type: String,
        },
        district: {
            type: String,
        },
        ward: {
            type: String,
        },
        address: {
            type: String
        }
    },
    vouchers: {
        system_vouchers: {
            type: Array,
            default: []
        },
        shop_vouchers: {
            type: Array,
            default: []
        }
    },
    orders: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export default model('Info', InfoSchema)