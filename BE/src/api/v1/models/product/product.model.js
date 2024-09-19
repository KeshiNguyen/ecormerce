'use strict'
import { model, Schema } from 'mongoose';
import slugify from 'slugify';

const ProductSchema = new Schema({
    product_name: {
        type: String,
        required: true,
        maxLength: 255,
        validate: {
            validator: (value) => {
                return /^[a-zA-Z0-9\s]+$/i.test(value);
            },
            message: 'Product name should only contain alphanumeric characters and spaces.'
        }
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
    product_salePrice: {
        sale_price: {
            type: Number,
        },
        sale_start_date: {
            type: Date,
        },
        sale_end_date: {
            type: Date,
        },
        sale_percentage: {
            type: Number,
            min: 0,
            max: 100
        }
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['electronics', 'clothing','furniture'],
    },
    product_shop : {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    product_attributes : {
        type: Schema.Types.Mixed,
        required: true
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
    
    product_media: {
        type: String,
    },
    product_ratingAverage: {
        ratingAverageVal: {
            type: Number,
            set: (val) => Math.round(val *10) / 10
        },
        totalRating: {
            type: Number,
            default: 0
        },
        count_user_rating: {
            type: Number,
            default: 0
        },
        rateAverage: [{
            userId: {type: Schema.Types.ObjectId, ref: 'User'},
            rating: {type: Number, min: [1, 'Rating must be above 1'], max: [5, 'Rating must be above 5']}
        }],
    },
    product_variations:{
        type: Array,
        default: []
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
//create index for search
ProductSchema.index({
    product_name: 'text',
    product_description: 'text',
}, {
    default_language: 'english'
})

//Document middleware
ProductSchema.pre('save', async function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

const updateMiddleware = function (next) {
    const update = this.getUpdate();
    if (update.product_name) update.product_slug = slugify(update.product_name, { lower: true });
    next()
}

ProductSchema.pre('findOneAndUpdate', updateMiddleware)
ProductSchema.pre('updateOne', updateMiddleware)
ProductSchema.pre('findByIdAndUpdate', updateMiddleware)

const PRODUCT = model('Product', ProductSchema)
const CLOTH_PRODUCT = model('ClothProduct', clothingSchema)
const ELECTRONIC_PRODUCT = model('ElectronicProduct', eletronicSchema)
const FURNITURE_PRODUCT = model('FurnitureProduct', furnitureSchema)

export { CLOTH_PRODUCT, ELECTRONIC_PRODUCT, FURNITURE_PRODUCT, PRODUCT };
