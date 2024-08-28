import { Router } from 'express';

import { authentication } from '../../auth/authUtils.js';
import categoryController from '../../controllers/category/index.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';

const route = Router();

route.use(authentication)

route.post('/create', asyncHandler(categoryController.createCategory))

export default route