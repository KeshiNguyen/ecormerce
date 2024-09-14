import { model, Schema } from 'mongoose';

import { generateTrackingNumber } from '../../utils/generate/trackingNumber.js';
import { orderStatus, orderTrackingStatus } from '../../utils/list_of_enums.js';

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
                    address,
                    zipcode
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
        type: Object,
        enum: orderStatus,
        default: orderStatus.UNPAID
    },
    order_tracking: {
        trackingNumber: {
            type: String,
        },
        status: {
            type: Object,
            enum: orderTrackingStatus,
        }
    },
    cancel_order_reason: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
// async function update_order_status(code) {
//     const code = parseInt(code)
//     const status = Object.values(orderStatus).find(status => status.code === code)
//     if (!status) throw new Error('Invalid order status')
//     this.order_status = status;
//     next()
// }

// async function update_order_tracking_status(code) {
//     const code = parseInt(code)
//     const status = Object.values(orderTrackingStatus).find(status => status.code === code)
//     if (!status) throw new Error('Invalid tracking order status')
//     this.order_tracking.status = status;
// }
//middleware
OrderSchema.pre('save', async function (next) {
    this.order_trackingNumber = await generateTrackingNumber(this.order_shipping?.address?.country)
    next()
})
 
// OrderSchema.pre('updateOne', update_order_status);
// OrderSchema.pre('save', update_order_status);
// OrderSchema.pre('findByIdAndUpdate', update_order_status);

// OrderSchema.pre('updateOne', update_order_tracking_status);
// OrderSchema.pre('save', update_order_tracking_status);
// OrderSchema.pre('findByIdAndUpdate', update_order_tracking_status);

export default model('Order', OrderSchema)