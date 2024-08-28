import { CREATED, SuccessResponse } from '../../core/success.response.js';

import AccessService from "../../services/access/access.service.js";

'use strict'

class AccessController {
    //User Access
    signUp = async (req, res , next) => {
        new CREATED({
            message: 'Sign up successfully',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login successfully',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout successfully',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    //shop access
    shopSignUp = async (req, res, next) => {
        new CREATED({
            message: 'Sign up successfully',
            metadata: await AccessService.shopSignUp(req.body)
        }).send(res)
    }

    shopLogin = async (req, res, next) => {
        new SuccessResponse({
            message: 'Shop login successfully',
            metadata: await AccessService.shopLogin(req.body)
        }).send(res)
    }

    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Refresh token successfully',
            metadata: await AccessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}

export default new AccessController()