'use strict'

import { CREATED, SuccessResponse } from "../../core/success.response.js";

import AccountService from "../../services/user.service.js";

class AccountController {

    //address
    addAddress = async (req, res, next) => {
        new CREATED({
            message: "Address added successfully",
            metadata: await AccountService.addAddress({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    updateAddress = async (req, res, next) => {
        new SuccessResponse({
            message: "Address updated successfully",
            metadata: await AccountService.updateAddress(req.body, req.user.userId)
        }).send(res)
    }
    setDefaultAddress = async (req, res, next) => {
        new SuccessResponse({
            message: "set default Addresssuccessfully",
            metadata: await AccountService.setDefaultAddress({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }

    removeAddress = async (req, res, next) => {
        new SuccessResponse({
            message: "Address removed successfully",
            metadata: await AccountService.removeAddress({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }

    //profile
    updateInfo = async (req, res, next) => {
        new SuccessResponse({
            message: "Profile updated successfully",
            metadata: await AccountService.updateInfo(req.body, req.user.userId)
        }).send(res)
    }
}

export default new AccountController();