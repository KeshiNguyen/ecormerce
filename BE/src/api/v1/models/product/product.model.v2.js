import { model, Schema } from 'mongoose'

'use strict'

const ProductSchema = new Schema({
    product_name: {
        type: String,
        required: true,
        maxLength: 255,
    },
    product_thumb: [{
        url: {
            type: String,
        },
        alt: {
            type: String,
        }
    }],
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true,
        min: 0
    },
    product_salePrice: {
        type: Number,
        min: 0
    },
    product_quantity: {
        type: Number,
        required: true,
        min: 0
    },
    product_category: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    product_shop : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product_attributes : {
        type: Schema.Types.Mixed,
        required: true
    },
    product_media: {
        type: String,
    },
    product_gender: {
        type:String,
        enum: ['male', 'female', 'unisex'],
    },
    product_age: {
        type: String,
        enum: ['adult', 'child', 'baby'],
    },
    product_rating : {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    },
    material: {
        type: String,
    },
    color: {
        type: String,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

const bagSchema = new Schema({
    size: [{
        length: { type: Number, min: 0},
        width: { type: Number, min: 0},
        height: { type: Number, min: 0},
        strap_length: { type: Number, min: 0},
        capacity: {type: Number, min: 0}
    }],
    material: {
        type: String,
    },
    color: {
        type: String,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

const shoseAndSandals = new Schema ({
    brand: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
    },
    material: {
        type: String,
    },
    color: {
        type: String,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})
const PRODUCT = model('Product', ProductSchema)
const CLOTH_PRODUCT = model('ClothProduct', clothingSchema)
const ELECTRONIC_PRODUCT = model('ElectronicProduct', eletronicSchema)
const BAG_PRODUCT = model('BagProduct', bagSchema)
const SHOES_AND_SANDALS = model('ShoesAndSandals', shoseAndSandals)
export { CLOTH_PRODUCT, ELECTRONIC_PRODUCT, PRODUCT }
