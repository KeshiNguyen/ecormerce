import { Router } from 'express';

import { authentication } from "../../auth/authUtils.js";
import AccountController from '../../controllers/user/index.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';

const route = Router();

route.use(authentication)
route.post('/address/add_user_address',asyncHandler(AccountController.addAddress))
route.put('/address/update_user_address',asyncHandler(AccountController.updateAddress))
route.put('/address/set_default_address',asyncHandler(AccountController.setDefaultAddress))
route.post('/address/remove_user_address', asyncHandler(AccountController.removeAddress))
route.put('/profile/update',asyncHandler(AccountController.updateInfo))
export default route