'use strict'

import { BadRequestError, ForbiddenError, NotFoundError } from "../core/error.response.js";
import { Info, User } from "../models/index.model.js";

/*
    editInfo::::
    {
        userId: ,
        user_info: {
            display_name,
            gender,
            birthday,
            receipt_email,
            phone_number,
        }
    }

    edit address::::
    {
        
    }

    add address::::
    address:{
        name,
        phone,
        country,
        city,
        district,
        ward,
        address,
    },
    address_flag: {
        address_type: 'home' | 'work',
        as_default: true | false,
        as_pickup: true | false,
        as_return: true | false,
    }
*/
class AccountService {
    static findByEmail = async ({ email }) => {
        return await User.findOne({ email }).lean();
    }
    
    static findById = async ({ _id }) => {
        return await User.findById(_id).lean();
    }
    //profile

    /*
        {
            user_info: {
                display_name,
                gender,
                birthday,
                receipt_email,
                phone_number
            }
        }
    */
    static updateInfo = async (profile = {},userId) => {
        console.log(profile)
        const updateInfo= await Info.findOneAndUpdate(
            {userId},
            [{
                $set: {
                    "profile": {
                        $mergeObjects : [
                            "$$ROOT.profile",
                            profile
                        ]
                    }
                }
            }],
            {
                new: true,
                lean: true,
            }
        ).select("profile")

        return updateInfo
    }

    //address
    static setDefaultAddress = async ({userId, address_id}) => {
        return await Info.findOneAndUpdate(
            {
                userId,
            },
            {
                $set: {
                    "addresses.$[matching].address_flag.as_default": true
                },
                $unset: {
                    "addresses.$[other].address_flag.as_default": ""
                }
            },
            {
                arrayFilters: [
                    {'matching.address.id': address_id},
                    {'other.address.id': {$ne: address_id}}
                ],
                new: true,
                lean: true
            }
        ).select("addresses")
    }

    static addAddress = async ({addresses = {}, userId}) => {
        const addedInfo = await Info.findOneAndUpdate(
            {userId},
            {
                $push: {
                    "addresses": {
                        "address": addresses.address,
                        "address_flag": addresses.address_flag
                    }
                }
            },
            {new: true}
        )
        if (addedInfo.addresses.length < 2 || addresses?.address_flag?.as_default ) {
            return await AccountService.setDefaultAddress({
                userId: userId,
                address_id: addedInfo.addresses.slice(-1)[0]?.address?.id
            })
        }
        return addedInfo
    }

    static updateAddress = async ({address = {},address_flag = {},address_id}, userId) => {
        const listAddress = await Info.findOne({userId, "addresses.address.id": address_id}).select("addresses").lean()
        if (!listAddress) throw new NotFoundError('Address not found');
        const foundAddress= listAddress.addresses.find(addr => addr.address.id === address_id)
        if(foundAddress.address_flag?.as_default && !address_flag?.as_default) throw new BadRequestError('Để hủy địa chỉ mặc định này, vui lòng chọn địa chỉ klhasc làm địa chỉ mặc định mới!')
        const updateAddr = await Info.findOneAndUpdate(
            {
                userId,
                "addresses.address.id": address_id
            },
            [{
                $set: {
                    "addresses": {
                        $map: {
                            input: "$addresses",
                            in: {
                                $cond: {
                                    if: { $eq: ["$$this.address.id", address_id] },
                                    then: {
                                        $mergeObjects: [
                                            "$$this",
                                            {
                                                address: {
                                                    $mergeObjects: [
                                                        "$$this.address",
                                                        address
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                    else: "$$this"
                                },
                            }
                        }
                    }
                }
            }],
            {
                new: true,
                lean: true
            }
        ).select("addresses")

        if(address_flag?.as_default) {
            return await AccountService.setDefaultAddress({
                userId: userId,
                address_id: address_id
            })
        }
        return updateAddr
    }

    static removeAddress = async ({address_id, userId}) => {
        const foundAddress = await Info.findOne(
            {
                userId,
                "addresses.address.id": address_id
            },
        )
        if (!foundAddress) {
            throw new ForbiddenError("You have not permission to access this resource");
        }
        const addressToRemove = foundAddress.addresses.find(addr => addr.address.id === address_id);
        if(addressToRemove?.address_flag?.as_default && foundAddress.addresses.length > 1) throw new BadRequestError("Địa chỉ này đang để mặc định. Vui lòng chọn một địa chỉ khác làm mặc định trước khi xóa địa chỉ này!")
        return await Info.findOneAndUpdate(
            {
                userId: userId,
            },
            {
                $pull: {
                    "addresses": {
                        "address.id": address_id
                    }
                }
            },
            {
                new: true,
                lean: true
            }
        ).select("addresses")
    }

    static getAddressDefault = async ({userId}) => {
        const user_address = await Info.findOne(
            {userId, "addresses.address_flag.as_default": true},
            {"addresses.$":1},
            {lean: true}
        )
        if(!user_address) throw new BadRequestError('User chưa thiết lập địa chỉ mặc định')
        return user_address.addresses[0]
    }

    static getAddressPickUp = async ({userId}) => {
        const found_shop = await User.findOne({_id: userId, role: {$in: ["shop"]}}).lean()
        if(!found_shop) throw new NotFoundError('Shop is not registered')
        const shop_address = await Info.findOne(
            {userId, "addresses.address_flag.as_pickup": true},
            {"addresses.$":1},
            {lean: true}
        )
        if(!shop_address) throw new BadRequestError('Shop chưa thiết lập địa chỉ lấy hàng')
        return shop_address.addresses[0]
    }
}

export default  AccountService
