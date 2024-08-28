import { Router } from 'express';

import { authentication } from '../../auth/authUtils.js';
import discountController from '../../controllers/discount/index.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { validateBodyCreateDiscount } from '../../middleware/checkRequiredFields/index.js';

const route = Router();

route.get('/list_product_of_discount', asyncHandler(discountController.getAllProductsOfDiscountCodes))
route.get('/list_discounts_shop', asyncHandler(discountController.getAllDiscountCodesOfShop))
route.post('/check_available', asyncHandler(discountController.checkAvailabilityDiscount))
route.get('/search', asyncHandler(discountController.searchDiscount))
route.use(authentication)

route.post('/create',validateBodyCreateDiscount, asyncHandler(discountController.createDiscountCode))

route.patch('/update/:discountId', asyncHandler(discountController.updateDiscount))

route.post('/save', asyncHandler(discountController.saveDiscount))

export default route