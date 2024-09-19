'use strict'
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { isValidPhoneNumber } from '../../validations/regex.js';

const InfoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',

        required: true,
    },
    profile: {
        display_name: {
            type: String,
            required: true,
            maxLength: 100,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            default:'male'
        },
        birthday: {
            type: Date,
            validate: {
                validator: function (value) {
                    return value < new Date();
                },
                message: 'Birthday must be in the past.'
            }
        },
        receipt_email: {
            type: String,
            default: ''
        },
        phone_number: {
            type: String,
            validate: {
                validator: isValidPhoneNumber
            },
            default: ''
        },
    },
    addresses: [
        {
            address: {
                id: {
                    type: String,
                    required: true,
                    default: uuidv4,
                },
                name: {
                    type: String,
                    required: true,
                },
                phone: {
                    type: String,
                    required: true,
                    validate: {
                        validator: isValidPhoneNumber
                    }
                },
                country: {
                    type: String,
                    default: 'Viet Nam',
                },
                city: {
                    type: String,
                },
                district: {
                    type: String,
                },
                ward: {
                    type: String,
                },
                address: {
                    type: String
                },
                address_type: {
                    type: String,
                    enum: ['home', 'work'],
                    default: 'home'
                },
            },
            address_flag: {
                as_default: {
                    type: Boolean,
                    default: false
                },
                as_pickup : {
                    type: Boolean,
                    default: false
                },
                as_return: {
                    type: Boolean,
                    default: false
                }
            },
        }
    ],
    
    vouchers: {
        system_vouchers: {
            type: Array,
            default: []
        },
        shop_vouchers: {
            type: Array,
            default: []
        }
    },
    orders: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

//index

InfoSchema.index({ 'userId': 1 }, { unique: true })
InfoSchema.index({'userId': 1, 'addresses.address.id': 1})

export default model('Info', InfoSchema)