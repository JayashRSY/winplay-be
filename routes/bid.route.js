import express from 'express';
const router = express.Router();
import {
    createBid
} from '../controllers/bid.controller.js';

router.post('/createBid', createBid);

export default router;