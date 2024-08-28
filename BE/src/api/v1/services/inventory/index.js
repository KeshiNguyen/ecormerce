'use strict';

import { BadRequestError } from "../../core/error.response.js";
import { Inventory } from "../../models/index.model.js";
import { getProductById } from "../../models/repositories/product.repo.js";

/*
    InventoryService:: Hang ton kho:: shop
    Nghiep vu: khi luong ton kho gan het,shop se nhạn duoc thong bao so luong san pham sap het, de nghi cap nhat so luong
    1 - add stock
*/
class InventoryService {
    static async addStockToInventory({stock, productId, shopId,location='ABC'}) {
        const product = await getProductById(productId)
        if(!product) throw new BadRequestError('Product not found')
        const query = {inven_shop: shopId, inven_product: productId},
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        },
        options = {
            upsert: true,
            new: true
        }
        return await Inventory.findOneAndUpdate(query, updateSet, options)
    }
}

export default InventoryService