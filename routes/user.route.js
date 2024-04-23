import express from 'express';
const router = express.Router();
import {
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserByEmail,
    getUser
} from '../controllers/user.controller.js';

router.get('/getAllUsers', getAllUsers);
router.get('/getUser', getUser);
router.get('/getUserById/:id', getUserById);
router.delete('/deleteUserById/:id', deleteUserById);
router.put('/updateUserByEmail', updateUserByEmail);

export default router;