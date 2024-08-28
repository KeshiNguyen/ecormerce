import { Router } from "express";

import { authentication } from "../../auth/authUtils.js";
import orderController from "../../controllers/order/index.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";

const route = Router();

route.use(authentication)

route.post('/checkout_review', asyncHandler(orderController.checkoutReview))

export default route