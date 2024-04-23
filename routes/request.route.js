import express from 'express';
const router = express.Router();
import {
    createDepositRequest,
    createWithdrawRequest,
    acceptRequest,
    rejectRequest,
    getRequests,
    getAllRequests
} from '../controllers/request.controller.js';

router.post('/createDepositRequest', createDepositRequest);
router.post('/createWithdrawRequest', createWithdrawRequest);
router.get('/getAllRequests', getAllRequests);
router.get('/getRequests', getRequests);
router.post('/acceptRequest', acceptRequest);
router.post('/rejectRequest', rejectRequest);

export default router;