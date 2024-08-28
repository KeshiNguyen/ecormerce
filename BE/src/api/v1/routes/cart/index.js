import { Router } from 'express';

import cartController from '../../controllers/cart/index.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';

const route = Router();

route.post('',asyncHandler(cartController.addToCart))
route.get('/list_cart',asyncHandler(cartController.listProductsCart))
route.post('/update',asyncHandler(cartController.update))
route.delete('',asyncHandler(cartController.delete))

export default route