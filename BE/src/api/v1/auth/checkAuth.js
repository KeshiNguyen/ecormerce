import { findApiKey } from '../services/apiKey.service.js';

'use strict';
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                code: 403,
                message: 'Forbidden Error',
                status: 'error'
            });
        }

        //check objKey

        const objKey = await findApiKey(key)
        if(!objKey) {
            return res.status(403).json({
                code: 403,
                message: 'Forbidden Error',
                status: 'error'
            });
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions) {
            return res.status(403).json({
                code: 403,
                message: 'permission not found',
                status: 'error'
            });
        }

        console.log(`permision::`, req.objKey.permissions)

        const validPermissions = req.objKey.permissions.includes(permission);
        if(!validPermissions) {
            return res.status(403).json({
                code: 403,
                message: 'permision deny',
                status: 'error'
            });
        }

        return next();
    }
}

export { apiKey, permission };
