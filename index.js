import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from "morgan";
import helmet from "helmet";
import dotenv from 'dotenv';
import http from 'http';
// import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './.env' });
import { verifyToken } from './utilities/verifyToken.js';
import connectDB from './utilities/db.js';

import authRoutes from './routes/auth.route.js';
import requestRoutes from './routes/request.route.js';
import bidRoutes from './routes/bid.route.js';
import userRoutes from './routes/user.route.js';
import periodRoutes from './routes/period.route.js';
import transactionRoutes from './routes/transaction.route.js';
import { initializeSocket } from './helpers/socketHandlers.js';

const app = express();

connectDB();
// Start the server
const port = process.env.PORT || 3000;
let server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
initializeSocket(server);

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['https://displate-fe.vercel.app', 'https://displate.netlify.app', 'http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.static(path.resolve(__dirname, 'public')));

// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// let upload = multer({ storage: storage });

// Define routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Displate API'
    })
});
app.use('/api/auth', authRoutes);
app.use('/api/request', verifyToken, requestRoutes);
app.use('/api/bid', verifyToken, bidRoutes);
app.use('/api/period', verifyToken, periodRoutes);
app.use('/api/transaction', verifyToken, transactionRoutes);
app.use('/api/user', verifyToken, userRoutes);
// app.use('/api/transaction', transactionRoutes);
// app.use('/api/bid', bidRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})



