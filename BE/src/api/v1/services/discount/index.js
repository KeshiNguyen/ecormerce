'use strict'
import { Types } from 'mongoose'

import { BadRequestError } from '../../core/error.response.js'
import { Discount, Info } from '../../models/index.model.js'
import {
    findAllDiscountCodeUnselect,
    findDiscount,
    findDiscountByCode,
    searchDiscount
} from '../../models/repositories/discount.repo.js'
import { findAllProducts, owenOfProducts } from '../../models/repositories/product.repo.js'

/*
    DiscountSerVice::
    1 - Generate discount code admin/shop
    2 - get discount amount
    3 - get all discount
    4 - Verify discount
    5 - Delete discount
    6 - Cancel discount
*/
class DiscountSerVice {
    static async createDiscountCode (payload, shopId) {
        const {
            code , start_date, end_date, is_active,
            min_order_value, productIds, apply_to,
            name, description, type, value, max_value,
            max_uses, max_uses_per_user
        } = payload.item_discount

        const foundedDiscount = await findDiscountByCode({code})
        if(foundedDiscount) throw new BadRequestError('Discount code already exists')
        
        //kiem tra các productId co thuoc shop hay khong
        if(shopId && productIds && productIds.length) {
            const checkProduct = await owenOfProducts({
                shopId,
                productIds
            })
    
            if(checkProduct.length) {
                throw new BadRequestError('Some products are not owned by this shop')
            }
        }
        
        const newDiscount = await Discount.create({
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_is_active: is_active,
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_max_uses_per_user: max_uses_per_user,
            discount_apply_for: apply_to,
            discount_productId_can_use: productIds,
            discount_source: {
                type: shopId ? 'shop' : 'system',
                shopId: shopId || undefined
            },
            discount_min_order_value: min_order_value,
        })

        return newDiscount
    }

    static async updateDiscountCode (discountId,shopId,payload) {
        const foundDiscount = await findDiscount({
            filter: {
                _id: discountId,
                'discount_source.shopId': shopId,
            },
            model: Discount
        })

        if (!foundDiscount) throw new BadRequestError('Discount not found')

        const updateDiscount = payload.update_item_discount
        if (updateDiscount.discount_code && updateDiscount.discount_code !== foundDiscount.discount_code) {
            const foundedDiscountCode = await findDiscountByCode({code: updateDiscount.discount_code})
            if(foundedDiscountCode) throw new BadRequestError('Discount code already exists')
        }

        if(updateDiscount.discount_productId_can_use) {
            const checkProduct = await owenOfProducts({
                shopId,
                productIds: updateDiscount.discount_productId_can_use
            })
            if(checkProduct.length) {
                throw new BadRequestError('Some products are not owned by this shop')
            }
        }
        return await Discount.findByIdAndUpdate(discountId, payload.update_item_discount, {new: true})
    }

    static async getAllProductsOfDiscountCodes({code, shopId, userId, limit, page}) {

        const foundedDiscount = await findDiscountByCode({code})
        if (!foundedDiscount) throw new BadRequestError('Discount code not found')
        if (!foundedDiscount.discount_is_active) throw new BadRequestError('Discount is not active')
        const {discount_apply_for, discount_productId_can_use, discount_shopId} = foundedDiscount
        let products = []
        if(discount_apply_for === 'all_products') {
            products = await findAllProducts({
                filter: {
                    product_shop: discount_shopId,
                    isPublished: true,
                },
                limit: +limit || 50,
                page: +page || 1,
                sort: 'ctime',
                select: ['product_name']
            })
        } else if (discount_apply_for === 'specific_products') {
            products = await findAllProducts({
                filter: {
                    isPublished: true,
                    _id: {$in: discount_productId_can_use}
                },
                limit: +limit || 50,
                page: +page || 1,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    static async getAllDiscountCodeOfShop ({limit, page, shopId}) {
        const discounts = await findAllDiscountCodeUnselect({
            filter: {
                'discount_source.shopId': shopId,
                discount_is_active: true,
            },
            limit: +limit || 50,
            page: +page || 1,
            unSelect: ['__v', 'discount_shopId','discount_source','discount_in_used','createdAt','updatedAt','discount_description','discount_used_user','discount_is_active'],
            model: Discount
        })
        return discounts
    }
    

    static async getDiscountShopV2 ({shopId, limit, page, productIds}) {
        const list_discounts = await findAllDiscountCodeOfShop({
            filter: {
                'discount_source.shopId': shopId,
                discount_is_active: true,
            }
        })
    }

    static async getDiscountAmount ({code, userId, shopId, products}) {
        const foundedDiscount = await findDiscount({
            filter: {
                discount_code: code,
                discount_shopId: new Types.ObjectId(shopId) || shopId,
                discount_is_active: true,
            },
            model: Discount
        })
        if(!foundedDiscount) throw new BadRequestError('Discount not found')
        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_max_uses_per_user,
            discount_apply_for,
            discount_productId_can_use,
            discount_used_user,
            discount_min_order_value,
            discount_type,
            discount_value,
            discount_max_value
        } = foundedDiscount

        let totalOrder = 0

        if(!discount_is_active) throw new BadRequestError('Discount is not active')
        if(!discount_max_uses) throw new BadRequestError('Discount are out')
        if(discount_start_date > new Date()) throw new BadRequestError(`Discount is avaiable to use from ${discount_start_date}`)
        if(discount_end_date < new Date()) throw new BadRequestError('Discount is expried')
        if(discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + product.quantity * product.price
            } , 0)
            if (totalOrder < discount_min_order_value) throw new BadRequestError('Discount requires a minium order value of ',discount_min_order_value)
        }

        if(discount_max_uses_per_user > 0) {
            const userUsedDiscount = discount_used_user.find(user => user.userId === user)
            if(userUsedDiscount) throw new BadRequestError('Discount is used')
        }
        

        const amount = discount_type === 'fixed_amount' ? discount_value : Math.min(totalOrder * (discount_value / 100), discount_max_value)
        return {
            discount: amount,
            totalOrder,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode ({shopId, codeId}) {
        const foundedDiscount = await findDiscount({
            filter: {
                discount_code: codeId,
                discount_shopId: shopId,
            },
            model: Discount
        })

        if(!foundedDiscount) throw new BadRequestError('Discount not found')

            //
        return await foundedDiscount.remove()
    }

    static async cancelDiscountCode ({shopId, codeId, userId}) {
        const foundedDiscount = await findDiscount({
            filter: {
                discount_code: codeId,
                discount_shopId: shopId,
            },
            model: Discount
        })
        if(!foundedDiscount) throw new BadRequestError('Discount not found')
        const result = await foundedDiscount.updateOne({
            $pull: {
                discount_used_user: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_in_used: -1
            }
        })

        return result
    }

    static async checkAvailabilityDiscount({codeId, totalPrice, productId}) {
        const foundedDiscount = await findDiscount({
            filter: {
                discount_code: codeId,
                discount_is_active: true,
            },
            model: Discount
        })

        if (!foundedDiscount) {
            return {
                check_availability: {
                    available: false,
                    message: 'Mã giảm giá không tồn tại'
                }
            };
        }

        const now = new Date()

        const optionsCheck = [
            {
                condition: foundedDiscount.discount_end_date < now,
                message: 'Mã giảm giá đã hết hạn'
            },
            {
                condition: foundedDiscount.discount_start_date > now,
                message: `Mã giảm giá khả dụng từ ${foundedDiscount.discount_start_date}`
            },
            {
                condition: !foundedDiscount.discount_max_uses,
                message: 'Mã giảm giá đã hết lượt sử dụng'
            },
            {
                condition: foundedDiscount.discount_min_order_value > totalPrice,
                message: `Giá trị đơn hàng chưa đạt điều kiện tối thiểu ${foundedDiscount.discount_min_order_value}, cần mua thêm ${foundedDiscount.discount_min_order_value - totalPrice}`
            },
            {
                condition: foundedDiscount.discount_productId_can_use.length && !foundedDiscount.discount_productId_can_use.includes(productId),
                message: 'Mã giảm giá  khong khả dụng cho sản phẩm nộy'
            }
        ]
        for (const { condition,  message} of optionsCheck ) {
            if(condition) {
                return {
                    check_availability: {
                        available: false,
                        message
                    }
                }
            }
        }
    
        return {
            check_availability: {
                available: true,
                discount: foundedDiscount
            }
        };
    }

    static async saveDiscountCode (userId, {code}) {
        const foundDiscount = await findDiscountByCode({code})
        if (!foundDiscount) throw new BadRequestError('Discount code not found')
        
        const updateFields = foundDiscount.discount_source.type === 'shop'
            ? 'vouchers.shop_vouchers' : 'vouchers.system_vouchers'
        return await Info.findOneAndUpdate(
            {userId: userId},
            {
                $addToSet: {
                    [updateFields]: code
                }
            },
            {new: true}
        )
    }

    static async searchDiscount ({code}) {
        return await searchDiscount({keySearch: code})
    }
}

export default DiscountSerVice
