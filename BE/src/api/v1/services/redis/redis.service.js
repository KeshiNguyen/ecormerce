'use strict';
import { createClient } from 'redis';
import { promisify } from 'util';

import { reservationInventory } from '../../models/repositories/inventory.repo.js';

const redisClient = createClient()

const pexpire = promisify(redisClient.PEXPIRE).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_key_${productId}_${quantity}_${cartId}`;
    const retryTime = 10;
    const expireTimeout = 3000;

    for (let i = 0; i < retryTime; i++) {
        //tao key cho san pham, chi nguoi nao nam giu key moi duoc thanh toan
        const result = await setnxAsync(key, expireTimeout);
        console.log(`result::${result}`)
        if(result === 1) {
            //thao tac voi inventory
            //...
            //sau khi thanh toan xong, xoa key
            const isReversable = await reservationInventory({productId, quantity, cartId});
            if(isReversable.modifiedCount) {
                await pexpire(key, expireTimeout);
                return key;
            }
            return null;
        } else {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}

const releaseLock = async ( keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    await await delAsyncKey(keyLock);
}

export { acquireLock, releaseLock };
