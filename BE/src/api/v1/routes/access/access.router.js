import { Router } from "express";

import { authentication } from "../../auth/authUtils.js";
import AccessController from "../../controllers/access/access.controller.js";
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { requiredFieldsSignUp, validateFieldsLoggin } from '../../middleware/checkRequiredFields/index.js';

const router = Router();

//login with google
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session:false }));

// router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
//     res.json({ message: 'Logged in with Google', user: req.user });
// });

router.post('/user/signup',requiredFieldsSignUp, asyncHandler(AccessController.signUp) )

router.post('/user/login',validateFieldsLoggin, asyncHandler(AccessController.login) )

router.post('/shop/signup', requiredFieldsSignUp,asyncHandler(AccessController.shopSignUp))

router.post('/shop/login',validateFieldsLoggin, asyncHandler(AccessController.shopLogin) )

//authentication
router.use(authentication)

router.post('/user/logout', asyncHandler(AccessController.logout) )

router.post('/user/refreshtoken', asyncHandler(AccessController.handleRefreshToken) )
export default router