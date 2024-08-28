import { model, Schema } from 'mongoose';

const clothingProduct = new Schema({
    size: {
        type: String,
        required: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    },
    color: {
        type: String,
        required: true,
    },
    material: {
        type: String,
        required: true}
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const beautyProduct = new Schema({
    capacity: {
        type: Number,
        // required: true,
        min: 0
    },
    material: {
        type: String,
        // required: true
    },
    expiration_date: {type: Date},
    from_country: {type: String},
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const homeAppliancesProduct = new Schema({
    capacity: {
        type: Number,
        // required: true,
        min: 0
    },
    material: {
        type: String,
        required: true
    },
    from_country: {type: String},
    manufacturer: {type: String},
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const furnitureProduct = new Schema({
    parameter: {
        length: { type: Number, min: 0},
        width: { type: Number, min: 0},
        height: { type: Number, min: 0},
        capacity: {type: Number, min: 0}
    },
    material: {
        type: String,
        required: true
    },
    from_country: {type: String},
    manufacturer: {type: String},
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const BEAUTY_PRODUCT = model('BEAUTY_PRODUCT', beautyProduct);
const CLOTHING_PRODUCT = model('CLOTHING_PRODUCT', clothingProduct);
const HOME_APPLIANCES_PRODUCT = model('HOME_APPLIANCES_PRODUCT', homeAppliancesProduct);
const FURNITURE_PRODUCT = model('FURNITURE_PRODUCT', furnitureProduct);
export { BEAUTY_PRODUCT, CLOTHING_PRODUCT, FURNITURE_PRODUCT, HOME_APPLIANCES_PRODUCT };

