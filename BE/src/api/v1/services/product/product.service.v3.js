'use strict';

import { BadRequestError } from '../../core/error.response.js';
import { PRODUCT } from "../../models/product/product.model.js";
import { CLOTH_PRODUCT, ELECTRONIC_PRODUCT, FURNITURE_PRODUCT } from "../../models/product/productAttribute.model.js";
import { findAllDraftsShop } from "../../models/repositories/product.repo.js";

class ProductFactory {
    static productRegistry = {} //key - class

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
    /*----PUT----*/

    static publishProductByShop ({product_shop, product_id}) {
        
    }

    static unPublishProductByShop ({product_shop, product_id}) {}

    /*----END PUT----*/

    /*----QUERY----*/
    static async findAllDraftShop ({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isDraft: true};
        return await findAllDraftsShop({query, limit, skip});
    }

    static async findAllPublishForShop ({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isPublished: true};
        return await findAllPublishForShop({query, limit, skip});
    }

    static async searchProducts ({keySearch}) {
        return await searchProductByUser({keySearch})
    }

    static async findAllProducts ({keySearch}) {
        return await searchProductByUser({keySearch})
    }

    static async findProduct ({keySearch}) {
        return await searchProductByUser({keySearch})
    }

}

//define base product class
class Product {
    constructor({
        product_name,product_thumb,product_description,product_price,product_quantity,
        product_type,product_shop,product_attributes,product_media, product_weight,
        product_dimensions
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
        this.product_weight = product_weight;
        this.product_dimensions = product_dimensions;
    }

    async createProduct(product_id) {
        return await PRODUCT.create({
            ...this,
            _id: product_id
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
}

//register product type
ProductFactory.registerProduct('electronic', ElectronicProduct)
ProductFactory.registerProduct('clothing', ClothingProduct)
ProductFactory.registerProduct('furniture', FurnitureProduct)

export default ProductFactory