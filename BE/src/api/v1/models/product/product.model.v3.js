'use strict'
import { model, Schema } from 'mongoose';
import slugify from 'slugify';

const ProductSchema = new Schema({
    product_name: {
        type: String,
        required: true,
        maxLength: 255,
    },
    product_slug: {
        type: String,
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);
            },
            message: 'Slug should only contain lowercase alphanumeric characters and hyphens.'
        },
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true
    },
    product_sale: {
        sale_Price: {
            type: Number,
            min: 0
        },
        sale_startDate: {
            type: Date
        },
        sale_endDate: {
            type: Date
        }
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    p_brand: {
        type:String,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['electronics', 'clothing','furniture','cosmetic'],
    },
    product_category: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    product_shop : {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    product_attributes : {
        type: Schema.Types.Mixed,
        required: true
    },
    product_media: {
        type: String,
    },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set : (val) => Math.round(val *10) / 10
    },
    product_variations:{
        type: Array,
        default: []
    },
    product_weight:{
        type: Number,
        default: 0
    },
    product_dimensions: {
        length: {
            type: Number, // chiều dài (cm)
        },
        width: {
            type: Number,  // chiều rộng (cm)
        },
        height: {
            type: Number,  // chiều cao (cm)
        },
        volumetric_weight: {
            type: Number,  // khối lượng thể tích
        }
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false //k show ra khi find
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false //k show ra khi find
    },

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
        type: String
    },
    material: {
        type: String,
    },
    color: {
        type: String,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    }
})

const eletronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true,
    },
    model: {
        type: String
    },
    color: {
        type: String,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    }
})

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: {
        type: String
    },
    material: {
        type: String,
    },
    color: {
        type: String,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    }
})

//Document middleware
ProductSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

ProductSchema.pre('save', function (next) {
    const dimensions = this.product_dimensions;
    if (dimensions.length && dimensions.width && dimensions.height) {
        this.product_dimensions.volumetric_weight = (dimensions.length * dimensions.width * dimensions.height) / 6000;
    }
    next();
});

const PRODUCT = model('ProductV3', ProductSchema)
const CLOTH_PRODUCT = model('ClothProduct', clothingSchema)
const ELECTRONIC_PRODUCT = model('ElectronicProduct', eletronicSchema)
const FURNITURE_PRODUCT = model('FurnitureProduct', furnitureSchema)

export { CLOTH_PRODUCT, ELECTRONIC_PRODUCT, FURNITURE_PRODUCT, PRODUCT };
