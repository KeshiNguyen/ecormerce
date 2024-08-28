'use strict'
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { createTokenPair } from "../../auth/authUtils.js";
import { AuthFailureError, BadRequestError, ForbiddenError } from '../../core/error.response.js';
import { Info, KeyToken, Shop, User } from "../../models/index.model.js";
import UserService from '../user.service.js';
import KeyTokenService from './keyToken.service.js';

import { getInfoData } from '../../utils/formatData.js';

class AccessService {
    static signUp = async ({email, username, password}) => {
        const holderUser = await User.findOne({email}).lean();
        if(holderUser) {
            throw new BadRequestError('Error:: User already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        //create new user
        const newUser = await User.create({
            email,
            username,
            password: passwordHash,
        })
        //create accessToken, refreshToken
        if(newUser) {
            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');
            console.log({privateKey, publicKey});
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey,
                privateKey
            })
            if(!keyStore) {
                throw new BadRequestError('Error:: Create key token failed');
            }
            const tokens = await createTokenPair({ userId: newUser._id, email }, publicKey, privateKey);
            await Info.create({
                userId: newUser._id,
            })
            return {
                user: getInfoData({fields: ['_id', 'username', 'email', 'role'], object: newUser}),
                tokens
            }
        }
    }

    static login = async ({ email, password, refreshToken = null }) => {
        /*
            step 1: check email
            step 2: match password
            step 3: create accessToken, refreshTOken
            step 4: generate Token
            step 5: get data login
        */

            const foundUser = await UserService.findByEmail({email});
            if(!foundUser) {
                throw new BadRequestError('User not found');
            }

            const isMatch = await bcrypt.compare(password, foundUser.password);
            if(!isMatch) {
                throw new AuthFailureError('Authentication failed');
            }

            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');

            const tokens = await createTokenPair({ userId: foundUser._id, email }, publicKey, privateKey);

            await KeyTokenService.createKeyToken({
                userId: foundUser._id,
                refreshToken: tokens.refreshToken,
                privateKey,
                publicKey
            })

            return {
                user: getInfoData({fields: ['_id', 'username', 'email', 'role'], object: foundUser}),
                tokens
            }
    }

    static logout = async ( keyStore ) => {
        const deleteKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log(`deleteKey ${deleteKey}`);
        return deleteKey
    }

    static handleRefreshToken = async ({refreshToken, user, keyStore}) => {
        /*
            Step 1: Check xem token da duoc su dung hay chua
                khi refreshToken expired, nguoi dung can dang nhap lai de lay token
                TH tokens bi danh cap => den khi token expired => tien hanh cap token moi => neu cap cho ca 2 => nghi ngo
                        =>loai bo token => chi nguoiu dung dang nhap bang email/password moi co token moi => dua ip cua hacker vao danh sacch chan
            Step 2: neu co => giai ma va xoa tat ca token trong keyStore
            Step 3: neu chua => dua cai refreshToken cu vao refreshTokenUsed
            Step 4: cap 1 cap token moi
        */
        const {userId, email} = user;
        //ccheck tokenn da duoc su dung hay chua
        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.removeKeyByUserId(userId);
            throw new ForbiddenError('Something went wrong. Please login again');
        }

        if(keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError('Token not found || user not register');
        }

        const foundUser = await UserService.findByEmail({email});

        if(!foundUser) throw new AuthFailureError('User not register');

        const tokens = await createTokenPair({ userId: foundUser._id, email }, keyStore.publicKey, keyStore.privateKey);

        //update lai token
        await KeyToken.updateOne(
            {_id: keyStore._id},
            {
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    //add refreshToken cu
                    refreshTokensUsed: refreshToken
                }
            }
        )
        return {
            user,
            tokens
        }
    }

    static shopSignUp = async (payload) => {
        const {email, username, password} = payload
        const holderShop = await Shop.findOne({ email: email }).lean();
        if(holderShop) {
            throw new BadRequestError('Error:: Shop already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        //create new shop
        const newShop = await Shop.create({
            email,
            name:username,
            password: passwordHash
        })
        //create accessToken, refreshToken
        if(newShop) {
            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) throw new BadRequestError('Error:: Create key token failed');
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
            console.log(`create token successfully::` , tokens)
            return {
                shop: getInfoData({fields: ['_id', 'email', 'name'], object: newShop}),
                tokens
            }
        }
    }

    static shopLogin = async ({email, password}) => {
        const foundShop = await Shop.findOne({ email}).lean();
        if(!foundShop) throw new BadRequestError('Shop not found');
        const isMatch = await bcrypt.compare(password, foundShop.password);
        if(!isMatch) throw new BadRequestError('Password not match');

        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);

        const keyStore = await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey
        })

        if (!keyStore) throw new BadRequestError('Error:: Create key token failed');
        return {
            shop: getInfoData({fields: ['_id', 'email', 'name'], object: foundShop}),
            tokens
        }
    }

    // static activeShop = async  (shopId, payload) => {
    //     const foundShop =  await Shop.findById(shopId)
    //     if(!foundShop) throw new BadRequestError('Shop not found');
    //     const  {basicInfoShop} = payload
    //     const basicInfoShop = 
    // }
}

export default AccessService