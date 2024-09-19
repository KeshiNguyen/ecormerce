'use strict';
import mongoose from 'mongoose';
import omitEmpty from 'omit-empty';

import { BadRequestError, ForbiddenError } from '../../core/error.response.js';
import { CLOTH_PRODUCT, ELECTRONIC_PRODUCT, FURNITURE_PRODUCT, PRODUCT } from "../../models/product/product.model.js";
import { createInventory } from '../../models/repositories/inventory.repo.js';
import {
    findAllDraftsForShop,
    findAllProducts,
    findAllPublishForShop,
    getProduct,
    searchProductByUser,
    updateProductById,
    updateProductByIdV2,
    updateRating
} from "../../models/repositories/product.repo.js";

class ProductFactory {
    static productRegistry = {}

    static registerProduct(product_type, classRef) {
        ProductFactory.productRegistry[product_type] = classRef
    }
    static async createProduct(product_type, payload) {
        const productClass = ProductFactory.productRegistry[product_type];
        if(!productClass) {
            throw new BadRequestError(`Invalid product type ${product_type}`);
        }
        return new productClass(payload).createProduct();
    }
    static async updateProduct (product_type, productId,userId, payload) {
        const productClass = ProductFactory.productRegistry[product_type];
        if(!productClass) {
            throw new BadRequestError(`Invalid product type ${product_type}`);
        }
        const foundShop = await PRODUCT.findById(productId).lean()
        if(foundShop.product_shop != userId ) throw ForbiddenError('You have not permission to update this product');
        return new productClass(payload).updateProduct(productId);
    }
    /*----PUT----*/

    static publishProductByShop = async ({ product_shop, product_id }) => {
        const product = await PRODUCT.findOne({ _id: product_id, product_shop: product_shop}).lean();
        if (!product) throw new BadRequestError('Input invalid');
        return await PRODUCT.findOneAndUpdate(
            { _id: product_id },
            {
                isPublished: true,
                isDraft: false
            },
            { new: true }
        )
    }
    static unPublishProductByShop = async ({ product_shop, product_id }) => {
        const product = await PRODUCT.findOne({ _id: product_id, product_shop: product_shop}).lean();
        if (!product) throw new BadRequestError('Input invalid');
        return await PRODUCT.findOneAndUpdate(
            { _id: product_id },
            {
                isPublished: false,
                isDraft: false
            },
            { new: true }
        )
    }

    /*----END PUT----*/

    /*----QUERY----*/
    static async findAllDraftShop ({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isDraft: true};
        return await findAllDraftsForShop({query, limit, skip});
    }

    static async findAllPublishForShop ({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isPublished: true};
        return await findAllPublishForShop({query, limit, skip});
    }

    static async searchProducts ({keySearch}) {
        return await searchProductByUser({keySearch})
    }

    static async findAllProducts ({limit = 50, sort = 'ctime' , page = 1 , filter= {isPublished: true}}) {
        return await findAllProducts({limit, sort, filter, page,
            select: ['product_name', 'product_thumb', 'product_price',  'product_quantity', 'product_shop']})
    }

    static async findProductById ({productId}) {
        return await getProduct({productId, unselect: ['__v','createdAt', 'updatedAt', 'product_type']})
    }

    static async updateRatingProduct({productId, userId, rating}) {
        return await updateRating({productId, userId, rating})
    }
}

//define base product class
class Product {
    constructor({
        product_name,product_thumb,product_description,product_price,product_quantity,
        product_type,product_shop,product_attributes,product_media,product_salePrice,
        product_weight, product_dimensions
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_media = product_media;
        this.product_salePrice = product_salePrice;
        this.product_weight = product_weight;
        this.product_dimensions = product_dimensions;
    }

    async createProduct(product_id) {
        const newProduct = await PRODUCT.create({
            ...this,
            _id: product_id
        })

        if(!newProduct) throw new BadRequestError(`Cannot create product`);
        await createInventory({
            productId: newProduct._id,
            stock: this.product_quantity,
            shopId: this.product_shop
        })
        return newProduct
    }

    async updateProduct({productId, payload, session}) {
        return await updateProductByIdV2({
            productId,
            updateFields: payload,
            model: PRODUCT,
            session
        })
    }
}

//define sub-class
class ElectronicProduct extends Product {
    
    async createProduct() {
        const newElectronic = await ELECTRONIC_PRODUCT.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) {
            throw new BadRequestError('Cannot create new product with atributes is electronic');
        }

        const newProduct = await super.createProduct(newElectronic._id);
        if(!newProduct) {
            throw new BadRequestError('Cannot create new product');
        }
        return newProduct
    }

    async updateProduct( productId) {
        /* remove null/undefined properties
            check place update
        */
        const objParams = omitEmpty(this)
        if(objParams.product_attributes) {
            await updateProductById({ product, objParams, model: ELECTRONIC_PRODUCT})
            objParams.product_attributes = await CLOTH_PRODUCT.findOne({ product: productId }, {select: ['_id', 'produt_shop','__v']})
        }
        console.log(`objparams::`, objParams)
        const updateProduct = await super.updateProduct(productId, objParams);
        return updateProduct
    }
}

class ClothingProduct extends Product {
    async createProduct() {
        const newCloth = await CLOTH_PRODUCT.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newCloth) {
            throw new BadRequestError('Cannot create new product with atributes is cloth');
        }

        const newProduct = await super.createProduct(newCloth._id);
        if(!newProduct) {
            throw new BadRequestError('Cannot create new product');
        }
        return newProduct
    }

    async updateProduct( productId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const objParams = omitEmpty(this)
            if(objParams.product_attributes) {
                await updateProductByIdV2({
                    productId,
                    updateFields: objParams.product_attributes,
                    model: CLOTH_PRODUCT,
                    session
                })
            }
            const updateProduct = await super.updateProduct({
                productId,
                payload:objParams,
                session
            });
            await session.commitTransaction();
            return updateProduct
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestError(error);
        } finally {
            session.endSession();
        }
    }
}
class FurnitureProduct extends Product {
    async createProduct() {
        const newFurniture = await FURNITURE_PRODUCT.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) {
            throw new BadRequestError('Cannot create new product with atributes is furniture');
        }

        const newProduct = await super.createProduct(newFurniture._id);
        if(!newProduct) {
            throw new BadRequestError('Cannot create new product');
        }
        return newProduct
    }

    async updateProduct( productId) {
        const objParams = this
        if(objParams.product_attributes) {
            await updateProductById({ product, objParams, model: FURNITURE_PRODUCT})
        }

        const updateProduct = await super.updateProduct(productId, objParams);
        return updateProduct
    }
}

//register product type
ProductFactory.registerProduct('electronic', ElectronicProduct)
ProductFactory.registerProduct('clothing', ClothingProduct)
ProductFactory.registerProduct('furniture', FurnitureProduct)

export default ProductFactory