import { SuccessResponse } from "../../core/success.response.js";

import CartService from "../../services/cart/index.js";

class CartController {

    //must logging
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Add to Cart success",
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessResponse({
            message: "Update cart success",
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete cart success",
            metadata: await CartService.removeProductFromUserCart(req.body)
        }).send(res)
    }

    listProductsCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Get cart success",
            metadata: await CartService.getUserCartGroupedByShop(req.query)
        }).send(res)
    }
}

export default new CartController()
