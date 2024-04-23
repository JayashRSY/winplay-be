import express from 'express';
const router = express.Router();
import {
    getActivePeriod,
    getAllClosedPeriods,
    getAllPeriods
} from '../controllers/period.controller.js';

router.get('/getActivePeriod', getActivePeriod);
router.get('/getAllClosedPeriods', getAllClosedPeriods);
router.get('/getAllPeriods', getAllPeriods);

export default router;