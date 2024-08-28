import mongoose from "mongoose";

import appConfig from '../../../configs/app.config.js';

// import { countConnect } from '../helpers/checkConnect.js';
const MONGO_URI = appConfig.mongodb.uri
const MONGO_DATABASE_NAME = appConfig.mongodb.dbName

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        //dev
        if(1===1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }
        mongoose.connect(MONGO_URI, {
            dbName: MONGO_DATABASE_NAME,
            maxPoolSize: 50,
        }).then(() => {
            console.log('MongoDB connected successfully with database: ', MONGO_DATABASE_NAME);
            // console.log('Number of connections: ' ,countConnect());
        }).catch((error) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + error);
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstance();

export default instanceMongoDb;