import dotenv from 'dotenv';

dotenv.config();

const config = {
    server: {
        port: process.env.PORT || 5000,
    },

    mongodb: {
        uri: process.env.MONGODB_URI,
        dbName: process.env.MONGODB_DB_NAME
    },
    redis: {
        uri: process.env.REDIS_URI,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN
    },

    sessionStorage: {

    },

    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
    }
}

export default config