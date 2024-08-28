import { Router } from "express";

import { authentication } from "../../auth/authUtils.js";
import inventoryController from "../../controllers/inventory/index.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";

const route = Router();

route.use(authentication)

route.post('', asyncHandler(inventoryController.addStockToInventory))

export default route