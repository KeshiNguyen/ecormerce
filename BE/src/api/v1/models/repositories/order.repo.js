import { Order } from "../index.model.js";


const getAllOrders = async ({limit, page, sort, filter}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime'? {_id: -1} : {_id: 1}
    const listOrders = await Order.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        // .select(getSelectData(select))
        .lean()
        .exec();
    return listOrders
}

const getDetailOrder = async ({orderId}) => {
    return await Order.findById({_id:orderId}).lean()
}

export {
    getAllOrders,
    getDetailOrder
};
