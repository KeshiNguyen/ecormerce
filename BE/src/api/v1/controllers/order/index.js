'use strict';

import { SuccessResponse } from "../../core/success.response.js";

import OrderService from "../../services/order/checkout.service.js";

class OrderController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Check out review successfully',
            metadata: await OrderService.checkoutReview(req.body)
        }).send(res)
    }
}

export default new OrderController;