'use strict';
import { model, Schema } from 'mongoose';

const PaymentSchema = new Schema({
    payment_orderId : {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    payment_userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    payment_status: {
        type: String,
        enum: ['pending', 'approved', 'failed'],
        default: 'pending'
    },
    payment_mmethod: {
        type: String,
        enum: ['system', 'user'],
        default: 'system'
    },
    payment_amount: {
        type: Number,
        required: true
    },
    payment_date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export default model('Payment', PaymentSchema)