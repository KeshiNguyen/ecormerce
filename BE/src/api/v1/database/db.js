
// import { connectMongoDb } from './init.mongodb.js';
// import { connectRedis } from './init.redis.js';
// // import { countConnect } from '../helpers/checkConnect.js';
// import appConfig from '../../../configs/app.config.js';
// const MONGO_URI = appConfig.mongodb.uri
// const MONGO_DATABASE_NAME = appConfig.mongodb.dbName
// class Database {
//     constructor() {
//         this.connect();
//     }
//     // connect(type = 'mongodb') {
//     //     //dev
//     //     if(1===1) {
//     //         mongoose.set('debug', true);
//     //         mongoose.set('debug', {color: true});
//     //     }
//     //     mongoose.connect(MONGO_URI, {
//     //         dbName: MONGO_DATABASE_NAME,
//     //         maxPoolSize: 50,
//     //     }).then(() => {
//     //         console.log('MongoDB connected successfully with database: ', MONGO_DATABASE_NAME);
//     //         // console.log('Number of connections: ' ,countConnect());
//     //     }).catch((error) => {
//     //         console.log('MongoDB connection error. Please make sure MongoDB is running. ' + error);
//     //     });
//     // }
//     connect (type) {
//         switch (type) {
//             case 'mongodb':
//                 connectMongoDb();
//                 break;
//             case 'redis':
//                 connectRedis();
//                 break;
//             default:
//                 break;
//         }
//     }
//     static getInstance() {
//         if (!Database.instance) {
//             Database.instance = new Database();
//         }
//         return Database.instance;
//     }
// }
// const instanceDb = Database.getInstance();
// export default instanceDb;