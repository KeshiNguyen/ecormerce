import { Router } from 'express';

import DeliveryController from '../../controllers/delivery/index.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';

const route = Router();

route.post('/fee',asyncHandler(DeliveryController.getFee))

export default route