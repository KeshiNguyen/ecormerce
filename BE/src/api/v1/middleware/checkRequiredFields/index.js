'use strict';
import { body, validationResult } from 'express-validator';

import { BadRequestError } from '../../core/error.response.js';

const requiredFieldsSignUp = [
    body('email').exists().withMessage('Please enter an email address'),
    body('password')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8-16 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{}|;:'",.<>?/])[A-Za-z\d!@#$%^&*()\-_=+[\]{}|;:'",.<>?/]{8,16}$/)
        .withMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new BadRequestError(errors.array()[0].msg);
        }
        next();
    }
];

const validateFieldsLoggin =  [
    body('email')
        .exists().withMessage('Email is not null')
        .isEmail().withMessage('Email is invalid'),
    body('password').exists().withMessage('Password is not null'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new BadRequestError(errors.array()[0].msg);
        }
        next();
    }
]

const validateBodyCreateDiscount = [
    body('item_discount.name').exists().withMessage('Please enter the discount name'),
    body('item_discount.value')
        .exists().withMessage('Please enter the discount value')
        .isNumeric().withMessage('value of discount must be a number'),
    body('item_discount.start_date')
        .exists().withMessage('Please enter the discount start date')
        .isISO8601().withMessage('Invalid date format. Expected YYYY-MM-DD')
        .isAfter(new Date().toISOString()).withMessage('start date must be a future date'),
    body('item_discount.end_date')
        .exists().withMessage('Please enter the discount end date')
        .isISO8601().withMessage('Invalid date format. Expected YYYY-MM-DD')
        .isAfter(new Date().toISOString()).withMessage('end date must be a future date')
        .custom((value, {req}) => {
            if(req.body.start_date > value) throw new BadRequestError('Start date must be before end date');
            return value
        }),
    body('item_discount.type').exists().withMessage('Please select the discount type'),
    body('item_discount.max_uses')
        .exists().withMessage('Please enter the maximum uses')
        .isNumeric().withMessage('max uses must be a number'),
    body('item_discount.max_value')
        .exists().withMessage('Please enter the maximum discount value')
        .isNumeric().withMessage('max value must be a number'),
    body('item_discount.min_order_value')
        .exists().withMessage('Please enter the minimum order value')
        .isNumeric().withMessage('min_order_value must be a number'),
    body('item_discount.max_uses_per_user')
        .exists().withMessage('Please enter the maximum uses per user')
        .isNumeric().withMessage('max uses per user must be a number'),
    body('item_discount.min_order_value')
        .exists().withMessage('Please enter the minimum order value')
        .isNumeric().withMessage('min order value must be a number'),
    body('item_discount.code').exists().withMessage('Please enter the discount code'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new BadRequestError(errors.array()[0].msg);
        }
        next();
    }
]

export {
    requiredFieldsSignUp, validateBodyCreateDiscount, validateFieldsLoggin
};
