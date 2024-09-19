'use strict'

import { BadRequestError } from '../../core/error.response.js';
import { Order } from '../../models/index.model.js';
import { findCart } from "../../models/repositories/cart.repo.js";
import {
    getAllOrders,
    getDetailOrder
} from '../../models/repositories/order.repo.js';
import { checkProductByServer } from '../../models/repositories/product.repo.js';
import discountService from '../discount/index.js';
import { acquireLock, releaseLock } from '../redis/redis.service.js';

import { orderStatus, orderTrackingStatus } from '../../utils/list_of_enums.js';

/*
    OrderService:: dịch vụ mua hàng
    Nghiệp vụ: user mua hàng, xem đơn hàng, hủy đơn hang. Khi user đặt hàng, mỗi đơn hàng = 1 shop.
    1 - checkoutReview :: kiểm tra dữ liệu của sản phẩm trưc khi thanh toan
    2 - orderByUser:: user đặt hàng, tiến hành kiểm tra sản phẩm => thanh toan.
        Vấn đề:: Trong cùng 1 thời điểm số lượng user đặt hangf quá lớn(trong 1 ngày, voucher) => hệ thống quá tải
    3 - getAllOrdersByUser:: lấy ra tất cả đơn hangf của người dùng bằng userId
    4 - getDetailOrderByUser:: lấy ra chi tiết đơn hàng của người dùng
    5 - cancelOrderByUser:: user huy đơn hang. Nếu user thanh toán rồi => hệ thống kiểm tra và hoàn trả số tiền về cho user
    6 - updateOrderStatus:: system cập nhật trạng thái đơn hàng mỗi khi có sự thay đổi
*/
class CheckoutService {
    /**
     * Checkout Review function to handle the checkout review process
     *
     * @param {Object} data - The data object containing the checkout information
     * @return {Promise} A promise that resolves to the checkout review object
     */

    /*
        payload:: {
            cartId,
            userId,
            shop_order_ids: [
                {//shop1
                    shopId,
                    shop_discounts: [],
                    item_products: [
                        {
                            quantity,
                            price,
                            productId,
                        }
                    ],
                },
                {//shop2
                    shopId,
                    shop_discount: [
                        {
                            shopId,
                            discountIds,
                            codeId
                        }
                    ],
                    item_products: [
                        {
                            quantity,
                            price,
                            productId,
                        }
                    ],
                }
            ]
        }
    */

        /*
            review san pham truoc khi check out by user
        */
    static async checkoutReview({cartId, userId, shop_order_ids=[]}) {
        // TODO: Implement checkout review process

        //Kiem tra cartId co ton tai hay khong
        const foundCart = await findCart({
            filter: {
                _id:cartId,
                cart_state: 'active'
            }
        })

        if (!foundCart) throw new BadRequestError('Cart not found')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout:0
        };
        const shop_order_ids_new = [];
        // const data = await CartService.getUserCartGroupedByShop({userId})
        // const shop_order_ids = data.shop_order_ids
        //tinh tong tien thanh toan
        for (let i = 0; i< shop_order_ids.length; i++) {
            const {shopId, shop_discounts = [], item_products = []} = shop_order_ids[i];
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`find product::`, checkProductServer)
            if(!checkProductServer[0]) throw new BadRequestError('order wrong!')

            //tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.price * product.quantity
            }, 0)

            
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,//tong so tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // neu shop_discounts > 0, kiem tra xem co kha dung hay khong
            if(shop_discounts.length) {
                // TODO: Implement shop discount
                const {totalPrice = 0, discount = 0} = await discountService.getDiscountAmount({
                    code: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                checkout_order.totalDiscount += discount

                if(discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            //tong thanh toan 
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount

            checkout_order.totalPrice += checkoutPrice
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser  ({shop_order_ids, cartId, userId, user_address = {}, user_payment= {}}) {
        const {shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // TODO: Implement order process
        // kiem tra so luong co vuot ton kho hay khong
        const products = shop_order_ids_new.flatMap(order => order.products)
        console.log(`checkout[1]::`,products)
        const acquireProduct = []
        for (let i =0;i< products.length; i++) {
            const {productId, quantity} = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId);
            acquireProduct.push(keyLock ? true : false);
            if(keyLock) {
                await releaseLock(keyLock);
            }
        }
        //neu co san pham het hang
        if(acquireProduct.includes(false)) {
            throw new BadRequestError('Some product already update, pls back to cart!')
        }
        const newOrder = await Order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })
        //neu thanh cong thi remove product trong cart
        return newOrder
    }

    /*
        query all orders of user
    */
    static async getAllOrdersByUser({userId, limit, page, sort = 'ctime' }) {
        return await getAllOrders({limit, sort, page, filter: {order_userId: userId}})
    }
    /*
        get detail of order
    */
    static async getDetailOrderByUser ({orderId}) {
        return await getDetailOrder({orderId})
    }

    /*
        user cancel order
    */
    static async cancelOrderByUser ({orderId, cancel_reasons }) {
        const foundOrder = await getDetailOrder({orderId})
        if(!foundOrder) throw new BadRequestError('Order not found')
        if(foundOrder?.order_status.code > 3 ) throw new BadRequestError('Cannot cancel order')
        return await Order.findByIdAndUpdate(
            {_id: orderId},
            {
                $set: {
                    order_status: {
                        code: 7
                    },
                    cancel_order_reason: cancel_reasons
                }
            },
            {new: true}
        )
    }

    /*
        system/shop update status of order after process:pending => confirmed order => prepare order => delivered order => shipped order:  => completed
    */
    static async updateOrderStatus ({orderId, code}) {
        // const foundOrder = await getDetailOrder({orderId})
        // if(!foundOrder) throw new BadRequestError('Order not found')
        // if(foundOrder?.order_status.value > 2) throw new BadRequestError('Cannot cancel order')
        const orderStatusValue = parseInt(code)
        let status = Object.values(orderStatus).find(status => status.code === orderStatusValue)
        return await Order.findByIdAndUpdate(
            {_id: orderId},
            {
                $set: {
                    order_status: status
                }
            },
            {new: true}
        )
    }

    static async trackingOrder ({orderId}) {
        const foundOrder = await getTrackingOrderilOrder({orderId})
        if(!foundOrder) throw new BadRequestError('Order not found')
        return foundOrder
    }

    static async updateTrackingOrderStatus ({orderId, code}) {
        // const foundOrder = await getTrackingOrder({orderId})
        // if(!foundOrder) throw new BadRequestError('Order not found')
        const orderStatusCode = parseInt(code)
        let status = Object.values(orderTrackingStatus).find(status => status.code === orderStatusCode)
        return await Order.findByIdAndUpdate(
            {_id: orderId},
            {
                $set: {
                    'order_tracking.status': status
                }
            },
            {new: true}
        )
    }
}

export default CheckoutService;