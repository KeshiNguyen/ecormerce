import ShopService from '../../services/shop/shop.service.js';

'use strict';
class ShopController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Sign up successfully',
            metadata: await ShopService.signUp(req.body)
        }).send(res)
    }
}

export default new ShopController()