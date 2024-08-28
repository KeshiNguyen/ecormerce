'use strict'

import { CREATED, SuccessResponse } from '../../core/success.response.js';

import DiscountService from '../../services/discount/index.js';

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new CREATED({
            message: 'Create discount code successfully completed',
            metadata: await DiscountService.createDiscountCode(req.body, req.user.userId)
        }).send(res)
    }

    updateDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update discount code successfully completed',
            metadata: await DiscountService.updateDiscountCode(
                req.params.discountId,
                req.user.userId,
                req.body
            )
        }).send(res)
    }

    getAllDiscountCodesOfShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get all discount codes successfully completed',
            metadata: await DiscountService.getAllDiscountCodeOfShop(req.query)
        }).send(res)
    }

    getAllProductsOfDiscountCodes = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get all product of codes successfully completed',
            metadata: await DiscountService.getAllProductsOfDiscountCodes({
                ...req.query
            })
        }).send(res)
    }

    getDiscountAmount = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get all discount codes successfully completed',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    checkAvailabilityDiscount = async(req,res, next) => {
        new SuccessResponse({
            message: 'Check discount availability successfully completed',
            metadata: await DiscountService.checkAvailabilityDiscount(req.body)
        }).send(res)
    }
    saveDiscount = async(req, res, next) => {
        new SuccessResponse({
            message: 'Save discount successfully completed',
            metadata: await DiscountService.saveDiscountCode(
                req.user.userId,
                req.body
            )
        }).send(res)
    }

    searchDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search discount successfully completed',
            metadata: await DiscountService.searchDiscount(req.query)
        }).send(res)
    }
}

export default new DiscountController()