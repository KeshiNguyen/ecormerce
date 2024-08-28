import { Router } from "express";

import { authentication } from "../../auth/authUtils.js";
import productController from "../../controllers/product/product.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";

const route = Router();

/*----QUERY*---*/
route.get('/all', asyncHandler(productController.getListAllProducts))
route.get('/:productId', asyncHandler(productController.getProductById))
route.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
route.get('/search/:keySearch', asyncHandler(productController.getListSearchProducts))

route.use(authentication)
route.post('/create', asyncHandler(productController.createProduct))

/*----PUT*---*/
route.post('/publish/:id',  asyncHandler(productController.publishProductByShop))
route.post('/unpublish/:id',asyncHandler(productController.unPublishProductByShop))

route.patch('/update/:productId', asyncHandler(productController.updateProductById))

export default route