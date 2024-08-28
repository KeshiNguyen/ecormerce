import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

// import { checkOverLoad } from './api/v1/helpers/checkConnect.js';
import instanceMongoDb from './api/v1/database/init.mongodb.js';
import { initRedis } from './api/v1/database/init.redis.js';
// import passport from 'passport';
import { removeEmptyProperties } from './api/v1/middleware/removeEmpty.middleware.js';
import router from './api/v1/routes/index.router.js';

const app = express();
const debug = createDebug('server:app');

//init middleware
app.disable('x-powered-by');
// app.use(csurf());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(hpp());
app.use(morgan('dev'));
app.use(compression())
// app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));
app.use(cors());
app.set('trust proxy', 1);
app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());
//init db
instanceMongoDb.connect();
initRedis()
// checkOverLoad();

//remove empty properties
app.use(removeEmptyProperties());

//init routes
app.use('/v1/api',router);

//hanling error 
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: err.stack,
        message: err.message || 'Internal Server Error',
    });
});

export default app;
