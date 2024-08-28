import { createClient } from 'redis';

import { REDIS_CONNECT_MESSAGE, REDIS_CONNECT_TIMEOUT } from '../../../configs/constants.js';
import { RedisError } from '../core/error.response.js';

let client = {},
connectionTimeOut,
statusConnection = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}

const hanldeTimeoutError = () => {
    connectionTimeOut = setTimeout(() => {
        throw new RedisError({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnect  = ({connectionRedis}) => {
    connectionRedis.on(statusConnection.CONNECT, () => {
        console.log(`connection Redis --- Connection status : connected`)
        clearTimeout(connectionTimeOut)
    })

    connectionRedis.on(statusConnection.END, () => {
        console.log(`connection Redis --- Connection status : disconnected`)
        hanldeTimeoutError()
    })

    connectionRedis.on(statusConnection.RECONNECT, () => {
        console.log(`connection Redis --- Connection status : reconnecting`)
        clearTimeout(connectionTimeOut)
    })

    connectionRedis.on(statusConnection.ERROR, (err) => {
        console.log(`connection Redis --- Connection status : error ${err}`)
        hanldeTimeoutError()
    })
}

const initRedis = () => {
    const instanceRedis = createClient()
    client.instanceConnect = instanceRedis
    handleEventConnect({connectionRedis: instanceRedis})

    instanceRedis.connect()
}

const getRedis = () => client

const closeRedisConnection = async () => {
    const { instanceConnect: redisConnection } = client;

    if (redisConnection) {
        await redisConnection.quit();
        console.log(`connection Redis --- quit successfully`)
    }
};

export {
    closeRedisConnection, getRedis, initRedis
};
