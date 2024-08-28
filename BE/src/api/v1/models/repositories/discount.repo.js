'use strict'

import { Discount } from "../index.model.js"

import { getSelectData, unGetSelectData } from "../../utils/formatData.js"

const findDiscountByCode = async ({code}) => {
    return await Discount.findOne({
        discount_code: code
    }).lean()
}

const findDiscount = async ({filter, model}) => {
    return await model.findOne(filter).lean()
}

const findAllDiscountCodeUnselect = async ({limit = 50, page = 1, sort = 'ctime',filter, model, unSelect}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime'? {_id: -1} : {_id: 1}
    const listDiscount = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean()
        .exec();
    return listDiscount
}

const findAllDiscountCodeSelect = async ({limit = 50, page = 1, sort = 'ctime',filter, model, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime'? {_id: -1} : {_id: 1}
    const listDiscount = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
        .exec();
    return listDiscount
}

const findAllDiscountCodeOfShop = async ({filter, select}) => {
    const listDiscount = await Discount.find(filter)
        .select(getSelectData(select))
        .lean();
    return listDiscount
}

const searchDiscount = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await Discount.find({
        $text: { $search: regexSearch },
    }, {
        score: {$meta: 'textScore' }
    })
        .sort({score: {$meta: 'textScore' }})
        .select(getSelectData(['discount_code', 'discount_source']))
        .populate({
            path: 'discount_source.shopId',
            select:'username'
        })
        .lean();

    const data = results.map(discount => ({
        id: discount._id,
        code: discount.discount_code,
        type: discount.discount_source?.type || null,
        shop: discount.discount_source?.type === 'shop' ? {shopId: discount.discount_source?.shopId?._id, shopName: discount.discount_source?.shopId?.username} : null
    }));
    return data
}

export {
    findAllDiscountCodeOfShop, findAllDiscountCodeSelect, findAllDiscountCodeUnselect, findDiscount, findDiscountByCode,
    searchDiscount
}
