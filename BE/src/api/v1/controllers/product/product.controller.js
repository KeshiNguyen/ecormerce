import { SuccessResponse } from '../../core/success.response.js';

// import productService from '../../services/product/product.service.js';
import productServiceV2 from '../../services/product/product.servicev2.js';

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new product successfully completed',
            metadata: await productServiceV2.createProduct(req.body.product_type, {
                    ...req.body,
                    product_shop: req.user.userId
                }
            )
        }).send(res)
    }

    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all draft products successfully completed',
            metadata: await productServiceV2.findAllDraftShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product successfully completed',
            metadata: await productServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish product successfully completed',
            metadata: await productServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    getListSearchProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product successfully completed',
            metadata: await productServiceV2.searchProducts(req.params)
        }).send(res)
    }

    getListAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list all product successfully completed',
            metadata: await productServiceV2.findAllProducts(req.query)
        }).send(res)
    }

    getProductById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get product successfully completed',
            metadata: await productServiceV2.findProductById(req.params)
        }).send(res)
    }

    updateProductById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update product successfully completed',
            metadata: await productServiceV2.updateProduct(
                req.body.update_item.product_type,
                req.params.productId,
                {
                    ...req.body.update_item
                }
            )
        }).send(res)
    }
}

export default new ProductController()