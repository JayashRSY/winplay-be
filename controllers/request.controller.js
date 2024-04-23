import mongoose from "mongoose";
import { errorHandler } from "../utilities/error.js"
import RequestModel from "../models/request.model.js";
import UserModel from "../models/user.model.js";
import TransactionModel from "../models/transaction.model.js";
import { getIO } from "../helpers/socketHandlers.js";

export const createDepositRequest = async (req, res, next) => {
    try {
        const { amount, paymentId } = req.body;
        if (!amount || !paymentId) return next(errorHandler(400, "Missing amount or paymentId"));
        const newRequest = await RequestModel.create({
            userId: new mongoose.Types.ObjectId(req.user._id),
            amount,
            paymentId,
            type: "deposit",
        });

        res.status(201)
            .json({
                success: true,
                message: "Deposit request created successfully",
                data: newRequest,
            })
    } catch (error) {
        next(error);
    }
}
export const createWithdrawRequest = async (req, res, next) => {
    try {
        const { amount, upiId } = req.body;
        if (!amount) return next(errorHandler(400, "Missing amount"));

        const user = await UserModel.findById(new mongoose.Types.ObjectId(req.user._id));
        if (user.walletBalance < req.body.amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
            });
        }
        // if (!user.upiId) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Please add UPI ID",
        //     });
        // }
        const newRequest = await RequestModel.create({
            userId: new mongoose.Types.ObjectId(req.user._id),
            amount,
            upiId,
            type: "withdraw",
        });

        res.status(201)
            .json({
                success: true,
                message: "Withdraw request created successfully",
                data: newRequest,
            })
    } catch (error) {
        next(error);
    }
}
export const acceptRequest = async (req, res, next) => {
    try {
        const requestId = req.body.requestId;
        const request = await RequestModel.findById(requestId).populate('userId');

        if (!request || request.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "No Active Request found",
            });
        }

        const user = request.userId;
        if (request.type === "withdraw" && user.walletBalance < request.amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
            });
        }

        if (request.type === "withdraw") {
            user.walletBalance -= request.amount;
        } else {
            user.walletBalance += request.amount;
        }

        const savedUser = await user.save();
        
        const newTransaction = new TransactionModel({
            userId: user._id,
            amount: request.amount,
            type: request.type === "withdraw" ? "withdraw" : "deposit"
        });
        const io = getIO();
        await Promise.all([
            newTransaction.save(),
            RequestModel.findByIdAndUpdate(requestId, { status: "accepted" }),
            io.emit('updatedUser', savedUser)
        ]);

        res.status(200).json({
            success: true,
            message: "Request accepted successfully",
            data: request,
        });
    } catch (error) {
        next(error);
    }
}

export const rejectRequest = async (req, res, next) => {
    try {
        const requestId = req.body.requestId;
        const request = await RequestModel.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }

        // Update request status to rejected
        request.status = "rejected";
        await request.save();

        res.status(200).json({
            success: true,
            message: "Request rejected successfully",
            data: request,
        });
    } catch (error) {
        next(error);
    }
}

export const getRequests = async (req, res, next) => {
    try {
        const requests = await RequestModel.find({ userId: new mongoose.Types.ObjectId(req.user._id) }).sort({ updatedAt: -1 }).lean();
        res.status(200)
            .json({
                success: true,
                message: "Requests fetched successfully",
                data: requests,
            })
    } catch (error) {
        next(error);
    }
}
export const getAllRequests = async (req, res, next) => {
    try {
        const requests = await RequestModel.find({}).sort({ updatedAt: -1 }).populate('userId').lean();
        res.status(200)
            .json({
                success: true,
                message: "All Requests fetched successfully",
                data: requests,
            })
    } catch (error) {
        next(error);
    }
}