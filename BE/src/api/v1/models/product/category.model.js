import { model, Schema } from 'mongoose';

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    has_child: {
        type: Boolean,
        default: false
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export default model('Category', CategorySchema)