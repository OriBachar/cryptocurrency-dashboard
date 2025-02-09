import express from 'express';
import errorHandler from 'errorhandler';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { config } from '../config/env';

const app = express();


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',

});
app.use(limiter);


app.use(compression({
    threshold: 100 * 1024,
    brotli: true
}));

app.use(helmet());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || config.server.whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(mongoSanitize());
app.use(hpp());

app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Path: ${req.path}`);
    next();
});

if (config.server.env === 'development') {
    app.use(errorHandler());
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

export default app;