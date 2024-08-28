'use strict';

import { Cart } from "../index.model.js";

const findCart = async ({filter}) => {
    return await Cart.findOne(filter);
}

const findCardById = async ({cartId}) => {
    return await Cart.findById(cartId).lean();
}

export {
    findCardById, findCart
};
