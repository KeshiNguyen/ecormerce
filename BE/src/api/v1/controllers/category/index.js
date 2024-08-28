import { SuccessResponse } from '../../core/success.response.js';

import CategoryService from '../../services/product/category.service.js';

'use strict'

class CategoryController {
    createCategory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new category successfully completed',
            metadata: await CategoryService.createCategory(req.body)
        }).send(res)
    }
}

export default new CategoryController()