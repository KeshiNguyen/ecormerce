import { model, Schema } from 'mongoose'

const inventorySchema = new Schema({
    inven_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    inven_location: {
        type: String,
        default: ''
    },
    inven_stock: {
        type: Number,
        require: true,
        min: 0
    },
    inven_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    inven_reservations: {
        /*
            Khi dat hang thi luu vao day
            {
                cartId:,
                stock: ,
                createdAt: ,
            }
        */
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export default model('Inventory', inventorySchema)