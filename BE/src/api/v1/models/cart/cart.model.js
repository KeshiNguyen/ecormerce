import { model, Schema } from 'mongoose'

const CartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'pending', 'completed', 'failed'],
        default: 'active',
    },
    cart_products: {
        type: Array,
        required: true,
        default: [],
    },
    cart_count_product: {
        type: Number,
        default: 0,
    },
    cart_userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})

export default model('Cart', CartSchema)