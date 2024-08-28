import JWT from 'jsonwebtoken'

import { AuthFailureError, ForbiddenError, NotFoundError } from '../core/error.response.js'
import { asyncHandler } from '../helpers/asyncHandler.js'

import KeyTokenService from '../services/access/keyToken.service.js'

const HEADER= {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'x-rtoken-id',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.error(`Error creating token pair: `, error)
        throw error
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        Step 1: check userId missing
        Step 2: get access token
        Step 3: verify
        Step 4:  check user
        Step 5: check keyStore
        Step 6: OK all
    
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request');

    const keyStore = await KeyTokenService.findByUserId(userId);

    if(!keyStore) throw new NotFoundError('Key not found');

    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
    
            if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User');
            
            req.keyStore = keyStore;
            req.user = decodeUser;
            console.log(`User::`, decodeUser)
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request');

    try {
        const accessToken = req.headers[HEADER.AUTHORIZATION];
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User');
        req.user = decodeUser;
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}

const checkOwenResourceByShop  = asyncHandler(async (req, res, next) => {
    const shopId = req.user.userId;
    const owenId = req.body.shopId || req.body.product_shop
    if(shopId !== owenId) throw new ForbiddenError('Access  permission to this resource is denied')
    next()
})

export { authentication, checkOwenResourceByShop, createTokenPair, verifyJWT }

