import { model, Schema } from 'mongoose';

import { generateTrackingNumber } from '../../utils/generate/trackingNumber.js';

const OrderSchema = new Schema({
    order_userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order_checkout: {
        /*
            order_checkout: {
                totalPrice,
                totalApplyDiscount,
                feeShip
            }
        */
        type: Object,
        default: {}
    },
    order_shipping: {
        /*
            order_shipping: {
                name,
                phone,
                address: {
                    country,
                    city,
                    district,
                    ward,
                    address
                }
            }
        */
        type: Object,
        default: {}
    },
    order_payment: {
        type: Object,
        default: {}
    },
    order_products: {
        type: Array,
        default: [],
        required: true
    },
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered', 'shipped', 'cancelled', 'success', 'returned'],
        default: 'pending'
    },
    order_trackingNumber: {
        type: String,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

//middleware
OrderSchema.pre('save', async function (next) {
    this.order_trackingNumber = await generateTrackingNumber(this.order_shipping?.address?.country)
    next()
})

export default model('Order', OrderSchema)