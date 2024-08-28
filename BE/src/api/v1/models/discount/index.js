'use strict';
import { model, Schema } from 'mongoose';

const discountSchema = new Schema({
    discount_name: {
        type: String,
        required: true,
        maxLength: 255,
    },
    discount_description: {
        type: String,
        required: true,
        maxLength: 255,
    },
    discount_source: {
        type: {
            type: String,
            enum: ['shop', 'system'],
            required: true
        },
        shopId: {
            type: Schema.Types.ObjectId,
            required: function () { return this.discount_source.type === 'shop' },
            ref: 'Shop',
        }
    },
    discount_type: {
        type: String,
        enum: ['fixed_amount','c'],
        default: 'fixed_amount',
    },
    discount_value: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function (val) {
                if (this.discount_type === 'percentage') return Number.isInteger(val) && val >= 5 && val <= 100
                return val
            },
            message: function (props) {
                return `${props.value} must be an integer between 5 and 100`
            }
        }
    },
    discount_max_value: { //giam toi da 
        type: Number,
        required: true,
    },
    discount_code: {
        type: String,
        required: true,
        unique: true
    },
    discount_start_date: {
        type: Date,
        required: true,
    },
    discount_end_date: {
        type: Date,
        required: true,
    },
    discount_max_uses: { // so discount toi da co the su dung
        type: Number,
        required: true,
        min: 0
    },
    discount_in_used: { // so discount da duoc su dung
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    discount_used_user: { //user da su dung discount
        type: Array,
        default: [],
    },
    discount_max_uses_per_user: { //so luong toi da ma user co the dung
        type: Number,
        required: true,
        min: 0,
    },
    discount_min_order_value: { // gia tri don hang toi thieu
        type: Number,
        required: true,
        min: 0,
    },
    discount_is_active: {
        type: Boolean,
        default: true
    },
    discount_apply_for: {
        type: String,
        enum: ['all_products','specific_products','specific_categories'],
        default: 'all_products',
    },
    discount_productId_can_use: { // ap dung cho san pham nao neu discount_apply_for !== 'all_products
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

//middleware 

discountSchema.index(
    { discount_code: 'text' }
)

export default model('Discount', discountSchema)