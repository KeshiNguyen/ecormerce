import { User } from "../models/index.model.js";

'use strict'

class userService {
    static findByEmail = async ({ email }) => {
        return await User.findOne({ email }).lean();
    }
    
    static findById = async ({ _id }) => {
        return await User.findById(_id).lean();
    }
}

export default  userService
