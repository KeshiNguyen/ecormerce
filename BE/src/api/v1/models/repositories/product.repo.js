'use strict';

import { PRODUCT } from "../product/product.model.js";

import { getSelectData, unGetSelectData, updateNestedObjectParserV2 } from "../../utils/formatData.js";

const queryProduct = async ({query, limit, skip}) => {
    return await PRODUCT.find(query)
        .populate('product_shop','name email -_id')
        .sort({updateAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({query, limit, skip})
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({query, limit, skip})
}

const searchProductByUser = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await PRODUCT.find({
        isDraft: false,
        isPublished: true,
        $text: { $search: regexSearch },
    }, {
        score: {$meta: 'textScore' } //tu duoc tim kiem chinh xac nhat
    })
        .sort({score: {$meta: 'textScore' }})
        .select(unGetSelectData(['createdAt', 'updatedAt', '__v', 'score']))
        .lean();
    return results
}

const findAllProducts = async({limit, page, sort, filter, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const listProducts = await PRODUCT.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
        .exec();
    return listProducts
}

const getProduct = async ({productId, unselect}) => {
    return await PRODUCT.findById({_id:productId}).select(unGetSelectData(unselect)).lean()
}

const getProductSelect = async ({productId, select}) => {
    return await PRODUCT.findById({_id:productId}).select(getSelectData(select)).lean()
}

const getProductById = async (productId) => {
    return await PRODUCT.findById(productId).lean()
}

const updateProductById = async({productId, payload, model, isNew = true}) => {
    return await model.findByIdAndUpdate(productId, payload, {new: isNew})
}

/**
 * Updates a product by its ID with the given updateFields by using TRANSACTION IN MONGO.
 * @param {Object} options - The options for updating the product.
 * @param {string} options.productId - The ID of the product to update.
 * @param {Model} options.model - The model of the product to update.
 * @param {Object} options.updateFields - The fields to update in the product.
 * @param {boolean} [options.isNew=true] - Whether to return the updated product or the original.
 * @returns {Promise<Object|null>} - The updated product or null if not found.
 */
const updateProductByIdV2 = async ({productId, model, updateFields, isNew = true, session}) => {
    // Find the product by its ID.
    let target = await model.findById(productId).session(session).lean();
    // Update the nested object fields in the target object.
    target = updateNestedObjectParserV2({target, updateFields});
    // Update the product in the database with the new target object.
    return await model.findByIdAndUpdate(productId, target, {new: isNew, session})
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await getProductById(product.productId)
        if(foundProduct) {
            return {
                price: foundProduct?.product_salePrice?.sale_price || foundProduct.product_price,
                quantity: foundProduct.product_quantity > product.quantity ? product.quantity : foundProduct.product_quantity,
                productId: foundProduct._id,
                weight: foundProduct?.product_weight || foundProduct.product_dimensions?.volumetric_weight
            }
        }
    }))
}

const updateRating = async ({productId, userId, rating}) => {
    return await PRODUCT.findByIdAndUpdate(productId, {
        $push: {
            "product_ratingAverage.rateAverage": {
                userId,
                rating
            }
        },
        $inc: {
            "product_ratingAverage.totalRating": rating,
            "product_ratingAverage.count_user_rating": 1
        },
        $set: {
            "product_ratingAverage.ratingAverageVal": {
                $round: [
                    {
                        $divide: [
                            { $add: ["$product_ratingAverage.totalRating", rating] },
                            { $add: ["$product_ratingAverage.count_user_rating", 1] }
                        ]
                    },
                    1
                ]
            }
        }
    })
}
const owenOfProducts = async ({shopId, productIds}) => {
    // if (!Array.isArray(productIds)) {
    //     const res = await PRODUCT.find({
    //         product_shop: shopId,
    //         _id: productIds
    //     })
    //     return res ? false : true
    // }
    let listIdsBelongShop =[], inValidIds=[];
    listIdsBelongShop = await PRODUCT.find({ product_shop: shopId }).select('_id').lean();
    listIdsBelongShop = listIdsBelongShop.map(item => item._id.toString());
    if (!listIdsBelongShop) return true;
    inValidIds = productIds.filter(item => !listIdsBelongShop.includes(item.toString()));
    console.log(`invalid product::`, inValidIds)
    return inValidIds
}
export {
    checkProductByServer,
    findAllDraftsForShop,
    findAllProducts,
    findAllPublishForShop,
    getProduct, getProductById,
    getProductSelect,
    owenOfProducts,
    searchProductByUser,
    updateProductById,
    updateProductByIdV2,
    updateRating
};
