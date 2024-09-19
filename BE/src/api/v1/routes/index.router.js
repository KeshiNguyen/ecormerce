import { Router } from "express";

import { apiKey, permission } from "../auth/checkAuth.js";
import accessRouter from './access/access.router.js';
import cartRouter from './cart/index.js';
import categoryRouter from './category/index.js';
import deliveryRouter from './delivery/index.js';
import discountRouter from './discount/index.js';
import inventoryRouter from './inventory/index.js';
import orderRouter from './order/index.js';
import productRouter from './product/product.route.js';
import accountRouter from './user/index.js';

const router = Router();

//check apiKey
router.use(apiKey)
//check permission

router.use(permission('0000'))

router.use('/auth',  accessRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);
router.use('/discount', discountRouter);
router.use('/cart', cartRouter);
router.use('/inventory', inventoryRouter)
router.use('/order', orderRouter);
router.use('/account', accountRouter);
router.use('/delivery', deliveryRouter);

export default router
