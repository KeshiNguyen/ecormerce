'use strict'
import { Types } from "mongoose"

import { NotFoundError } from "../../core/error.response.js"
import { Cart } from "../../models/index.model.js"
import { PRODUCT } from "../../models/product/product.model.js"
import { findCart } from "../../models/repositories/cart.repo.js"
import { getProductById } from "../../models/repositories/product.repo.js"

import { unGetSelectData } from "../../utils/formatData.js"

/*
    CartService:: gio hang :: user
    Nghiep vu: user xem, thêm sản phẩm vào giỏ hangf, thay đổi số lượng củâ sản phẩm
    1 - Create cart for user
    2 - Update cart
    2.1 - Update quantity
    2.2 - Add product
    3 - Delete cart
*/
class CartService {

    static async createUserCart ({userId, product}) {
        const foundProduct = await getProductById(product.productId)
        if(!foundProduct) throw new NotFoundError(`Product ${product.productId} not found`)
        const query = {cart_userId: userId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        },
        options = {
            upsert: true,
            new: true
        }

        return await Cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity ({userId, product}) {
        const {productId, quantity} = product,
        query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: "active"
        },
        updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        },
        options ={
            new: true,
            upsert: false
        };
        return await Cart.findOneAndUpdate(query, updateSet, options).select(unGetSelectData(['__v', 'createAt', 'updateAt']));
    }
    static async addToCart({ userId, product = {} }) {
        /*
            onClick addToProduct in porduct detail
        */
        const userCart = await findCart({
            filter: {cart_userId: userId},
        })

        if(!userCart) {
            return await CartService.createUserCart({userId: userId, product: product})
        }

        const foundProduct = userCart.cart_products.find(p => p.productId.toString() === product.productId.toString());
        
        //neu chua co san pham thi them vao
        if(!foundProduct) {
            userCart.cart_products.push(product);
            return await userCart.save();
        }
         //truong hop co san pham bi trung lap thi tang so luong
        return await CartService.updateUserCartQuantity({userId: userId, product: product})
    }

    static async addToCartV2({userId, shop_order_ids }){
        /*
            edit in cart detail
        */

        /*
            payload::
            shop_order_ids: {
                {
                    shopId,
                    item_products: [
                        {
                            quantity,
                            price,
                            shopId,
                            old_quantity;
                            productId
                        }
                    ],
                    version
                }
            }
        */
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0];
        console.log({productId, quantity, old_quantity})
        const foundProduct = await PRODUCT.findById(productId);
        if(!foundProduct) throw new NotFoundError('Product not found')

        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) throw new NotFoundError('Product not belong shop')

        if(quantity === 0) {
            return await CartService.removeProductFromUserCart({userId, productId})
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async removeProductFromUserCart ({userId, productId}) {
        const query = {
            cart_userId: userId,
            cart_state: 'active'
        },
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        };
        const deletedProduct = await Cart.updateOne(query, updateSet)
        return deletedProduct
    }

    static async getUserCartGroupedByShop({ userId }) {
        const cart = await Cart.aggregate([
            {
                $match: {
                    cart_userId: new Types.ObjectId(userId),
                    cart_state: 'active'
                }
            },
            {
                $unwind: "$cart_products"
            },
            {
                $group: {
                    _id: "$cart_products.shopId",
                    shopId: { $first: "$cart_products.shopId" },
                    item_products: {
                        $push: {
                            quantity: "$cart_products.quantity",
                            price: "$cart_products.price",
                            productId: "$cart_products.productId"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    shopId: 1,
                    item_products: 1
                }
            },
            {
                $group: {
                    _id: null,
                    shop_order_ids: {
                        $push: {
                            shopId: "$shopId",
                            item_products: "$item_products"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    shop_order_ids: 1
                }
            }
        ]).exec();
        return cart.length ? cart[0] : []; // Nếu không có kết quả trả về đối tượng rỗng
    }
}

export default CartService