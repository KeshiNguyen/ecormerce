'use strict'

import { SuccessResponse } from "../../core/success.response.js"

import DeliveryService from "../../services/delivery/index.js"

class DeliveryController {
    getFee = async(req, res, next) => {
        new SuccessResponse({
            message: "Get delivery fee success",
            metadata: await DeliveryService.getFee(req.body)
        }).send(res)
    }
}

export default new DeliveryController()