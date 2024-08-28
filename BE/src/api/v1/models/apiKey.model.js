import { model, Schema } from 'mongoose'

const apiKeySchema = new Schema({
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222'],
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export default model('ApiKey', apiKeySchema)