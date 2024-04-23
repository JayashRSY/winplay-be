import express from 'express';
const router = express.Router();
import {
    getTransactions,
    getAllTransactions
} from '../controllers/transaction.controller.js';

router.get('/getTransactions', getTransactions);
router.get('/getAllTransactions', getAllTransactions);

export default router;