'use strict';

import { Inventory } from "../index.model.js";

const createInventory = async ({productId, location, stock, shopId}) => {
    return await Inventory.create({
        inven_productId: productId,
        inven_location: location || 'unKnown',
        inven_stock: stock,
        inven_shopId: shopId
    });
}

const reservationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        inven_productId: productId,
        inven_stock: {
            $gte: quantity
        }
    },
    updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        push: {
            inven_reservations: {
                quantity,
                cartId,
                createdAt: new Date()
            }
        }
    },
    options = {
        new: true,
        upsert: true
    };

    return await Inventory.updateOne(query, updateSet)
}

export {
    createInventory,
    reservationInventory
};
