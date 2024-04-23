import mongoose from "mongoose";
import { errorHandler } from "../utilities/error.js"
import TransactionModel from "../models/transaction.model.js";

export const getTransactions = async (req, res, next) => {
    try {
        const transactions = await TransactionModel.find({ userId: new mongoose.Types.ObjectId(req.user._id) }).sort({ updatedAt: -1 }).lean();
        res.status(200)
            .json({
                success: true,
                message: "Transactions fetched successfully",
                data: transactions,
            })
    } catch (error) {
        next(error);
    }
}
export const getAllTransactions = async (req, res, next) => {
    try {
        if(req.user.role !== "admin") return next(errorHandler(401, "Unauthorized"));
        
        const transactions = await TransactionModel.find({}).sort({ updatedAt: -1 }).populate('userId').lean();
        res.status(200)
            .json({
                success: true,
                message: "All Transactions fetched successfully",
                data: transactions,
            })
    } catch (error) {
        next(error);
    }
}