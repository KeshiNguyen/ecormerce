'use strict'
import { model, Schema } from 'mongoose'

const ReviewSchema = new Schema ({
    r_userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    r_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    r_rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5']
    },
    r_description: {
        type: String
    },
    r_image: {
        type: Array
    },
    r_video: {
        type: Array
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})

export default model('Review', ReviewSchema)