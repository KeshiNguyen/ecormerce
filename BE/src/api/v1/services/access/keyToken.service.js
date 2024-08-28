import { KeyToken } from "../../models/index.model.js";

'use strict'

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            const filter = {user: userId}
            const update = {publicKey, privateKey, refreshTokensUsed: [], refreshToken};
            const options = {upsert: true, new: true}

            const tokens = await KeyToken.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await KeyToken.findOne({user: userId}).lean();
    }

    static removeKeyById = async (id) => {
        return await KeyToken.deleteOne(id);
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await KeyToken.findOne({refreshTokensUsed: refreshToken}).lean();
    }

    static removeKeyByUserId = async (userId) => {
        return await KeyToken.deleteOne({user: userId}).lean();;
    }

    static findByRefreshToken = async (refreshToken) => {
        return await KeyToken.findOne({refreshToken}).exec();
    }
}

export default KeyTokenService