
const orderStatus = {
    UNPAID : {
        code : 0,
        message : {
            en : 'UNPAID',
            vn : 'đơn hàng được tạo nhưng chưa thanh toán'
        }
    },
    READY_TO_SHIP : {
        code : 2,
        message : {
            en : 'READY_TO_SHIP',
            vn : 'đang chờ bên vận chuyển'
        }
    },
    PROCESSED : {
        code : 1,
        message : {
            en : 'PROCESSED',
            vn : 'người bán đang xử lý và đóng gói'
        }
    },
    RETRY_SHIP: {
        code : 3,
        message : {
            en : 'RETRY_SHIP',
            vn : 'giao hàng cho bên vận chuyển thất bại, đang sắp xếp lại việc giao hàng'
        }
    },
    SHIPPED : {
        code : 4,
        message : {
            en : 'SHIPPED',
            vn : 'đã giao cho bên vận chuyển'
        }
    },
    TO_CONFIRMED_RECEIVE : {
        code : 5,
        message : {
            en : 'TO_CONFIRMED_RECEIVE',
            vn : 'đơn hàng đã được nhận'
        }
    },
    IN_CANCEL : {
        code : 6,
        message : {
            en : 'IN_CANCEL',
            vn : 'đơn hàng đang được huỷ'
        }
    },
    CANCELLED : {
        code : 7,
        message : {
            en : 'CANCELLED',
            vn : 'đơn hàng đã huỷ'
        }
    },
    TO_RETURN : {
        code : 8,
        message : {
            en : 'TO_RETURN',
            vn : 'người dùng yêu cầu trả hàng, đơn hàng đang được xử lý trả lại'
        }
    },
    COMPLETED : {
        code : 9,
        message : {
            en : 'COMPLETED',
            vn : 'đơn hàng đã hoàn tất'
        }
    }
}

const orderTrackingStatus = {

    //Đặt hàng và Xác nhận
    ORDER_INIT : {
        code : 1,
        message : {
            en: 'ORDER_INIT',
            vn: 'Đơn hàng đang chờ xác nhận thông tin'
        }
    },
    ORDER_CREATED : {
        code: 2,
        message: {
            en: 'ORDER_CREATED',
            vn: 'Đơn hàng đã được được xác nhận'
        }
    },
    ORDER_SUBMITTED : {
        code: 3,
        name: {
            en: 'ORDER_SUBMITTED',
            vn: 'Đơn hàng đã được chuyển đến người bán'
        }
    },
    
    ORDER_FINALIZED : {
        code: 4,
        message: {
            en: 'ORDER_FINALIZED',
            vn: 'Đơn hàng đã được hoàn tất và xác nhận.'
        }
    },
    
    //Xử lý
    CONFIRMED : {
        code : 5,
        message : {
            en: 'CONFIRMED',
            vn: 'Người bán đã xác nhận đơn hàng'
        }
    },
    PACKAGING : {
        code : 6,
        message : {
            en: 'PACKAGING',
            vn: 'Người bán đang chuẩn bị và đóng gói hàng'
        }
    },

    

    //Lấy hàng và Giao hàng
    PICKUP_REQUESTED : {
        code : 7,
        message : {
            en: 'PICKUP_REQUESTED',
            vn: 'Người bán đã yêu cầu bên vận chuyển đến lấy hàng'
        }
    },
    PICKUP_PENDING : {
        code : 8,
        message : {
            en: 'PICKUP_PENDING',
            vn: 'Người bán đang đợi bên vận chuyển đến lấy hàng'
        }
    },
    PICKED_UP : {
        code : 9,
        message : {
            en: 'PICKED_UP',
            vn: 'Đơn hàng đã được giao cho bên vận chuyển'
        }
    },
    DELIVERY_PENDING : {
        code : 10,
        message : {
            en: 'DELIVERY_PENDING',
            vn: 'Đơn hàng đang được vận chuyển đến bạn'
        }
    },
    DELIVERED : {
        code : 11,
        message : {
            en: 'DELIVERED',
            vn: 'Giao hàng thanhf công'
        }
    },
    PICKUP_RETRY : {
        code : 12,
        message : {
            en: 'PICKUP_RETRY',
            vn: 'Giao hàng cho bên vận chuyển thất bại. Người bán đang sắp xếp lại việc lấy giao'
        }
    },
    TIMEOUT : {},
    LOST : {
        code : 13,
        message : {
            en: 'LOST',
            vn: 'Đơn hàng bị thất lạc'
        }
    },

    //Cập nhật và Trả hàng
    UPDATE : {
        code : 14,
        message : {
            en: 'UPDATE',
            vn: 'Đơn hàng đang được cập nhật'
        }
    },
    UPDATE_SUBMITTED : {
        code: 15,
        message: {
            en: 'UPDATE_SUBMITTED',
            vn: 'Yêu cầu cập nhật đơn hàng đã được gửi đi'
        }
    },
    UPDATE_CREATED : {
        code: 16,
        message: {
            en: 'UPDATE_CREATED',
            vn: 'Yêu cầu cập nhật đơn hàng đã được tạo'
        }
    },
    RETURN_STARTED : {
        code: 17,
        message: {
            en: 'RETURN_STARTED',
            vn: 'Quy trình trả hàng đã bắt đầu'
        }
    },
    RETURNED : {
        code: 18,
        message: {
            en: 'RETURNED',
            vn: 'Đơn hàng đã được trả lại'
        }
    },
    RETURN_PENDING : {
        code: 19,
        message: {
            en: 'RETURN_PENDING',
            vn: 'Đơn hàng đang chờ xử lý trả lại'
        }
    },
    RETURN_INITIATED : {
        code: 20,
        message: {
            en: 'RETURN_INITIATED',
            vn: 'Yêu cầu trả hàng đã được khởi tạo'
        }
    },
    EXPIRED : {
        code: 21,
        message: {
            en: 'EXPIRED',
            vn: 'Đơn hàng đã hết hạn'
        }
    },

    //Hủy đơn hàng
    CANCEL : {
        code: 22,
        message: {
            en: 'CANCEL',
            vn: 'Đơn hàng đã được hủy'
        }
    },
    CANCEL_CREATED : {
        code: 23,
        message: {
            en: 'CANCEL_CREATED',
            vn: 'Yêu cầu hủy đơn hàng đã được tạo'
        }
    },
    CANCELED : {
        code: 24,
        message: {
            en: 'CANCELED',
            vn: 'Đơn hàng đã bị hủy'
        }
    },

    //Thất bại
    FAILED_ORDER_INIT: {
        code: 25,
        message: {
            en: 'FAILED_ORDER_INIT',
            vn: 'Đơn hàng không thành công ở bước khởi tạo'
        }
    },
    FAILED_ORDER_SUBMITTED: {
        code: 26,
        message: {
            en: 'FAILED_ORDER_SUBMITTED',
            vn: 'Đơn hàng không thành công ở bước gửi đi'
        }
    },
    FAILED_ORDER_CREATED: {
        code: 27,
        message: {
            en: 'FAILED_ORDER_CREATED',
            vn: 'Đơn hàng không thành công ở bước xác nhận'
        }
    },
    FAILED_PICKUP_REQUESTED: {
        code: 28,
        message: {
            en: 'FAILED_PICKUP_REQUESTED',
            vn: 'Không thành công khi yêu cầu bên vận chuyển lấy hàng'
        }
    },
    FAILED_PICKED_UP: {
        code: 29,
        message: {
            en: 'FAILED_PICKED_UP',
            vn: 'Đơn hàng không được vận chuyển thành công'
        }
    },
    FAILED_DELIVERED: {
        code: 30,
        message: {
            en: 'FAILED_DELIVERED',
            vn: 'Giao hàng thất bại'
        }
    },
    FAILED_UPDATE_SUBMITTED: {
        code: 31,
        message: {
            en: 'FAILED_UPDATE_SUBMITTED',
            vn: 'Yêu cầu cập nhật đơn hàng không thành công'
        }
    },
    FAILED_UPDATE_CREATED: {
        code: 32,
        message: {
            en: 'FAILED_UPDATE_CREATED',
            vn: 'Không thành công khi tạo yêu cầu cập nhật đơn hàng'
        }
    },
    FAILED_RETURN_STARTED: {
        code: 33,
        message: {
            en: 'FAILED_RETURN_STARTED',
            vn: 'Quá trình trả hàng không thành công'
        }
    },
    FAILED_RETURNED: {
        code: 34,
        message: {
            en: 'FAILED_RETURNED',
            vn: 'Trả hàng thất bại'
        }
    },
    FAILED_CANCEL_CREATED: {
        code: 35,
        message: {
            en: 'FAILED_CANCEL_CREATED',
            vn: 'Yêu cầu hủy đơn hàng không thành công'
        }
    },
    FAILED_CANCELED: {
        code: 36,
        message: {
            en: 'FAILED_CANCELED',
            vn: 'Đơn hàng hủy thất bại'
        }
    },
}

export {
    orderStatus,
    orderTrackingStatus
}
