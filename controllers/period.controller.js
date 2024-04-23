import mongoose from "mongoose";
import { errorHandler } from "../utilities/error.js"
import RequestModel from "../models/request.model.js";
import UserModel from "../models/user.model.js";
import TransactionModel from "../models/transaction.model.js";
import BidModel from "../models/bid.model.js";
import PeriodModel from "../models/period.model.js";

export const getActivePeriod = async (req, res, next) => {
    try {
        const periods = await PeriodModel.find({ status: 'open' }).sort({ periodNumber: -1 }).lean();
        res.status(200)
            .json({
                success: true,
                message: "Active period fetched successfully",
                data: periods[0],
            })
    } catch (error) {
        next(error);
    }
}
export const getAllClosedPeriods = async (req, res, next) => {
    try {
        const periods = await PeriodModel.find({ status: 'close' }).sort({ periodNumber: -1 }).lean();
        res.status(200)
            .json({
                success: true,
                message: "All closed Periods fetched successfully",
                data: periods,
            })
    } catch (error) {
        next(error);
    }
}
export const getAllPeriods = async (req, res, next) => {
    try {
        const periods = await PeriodModel.find({}).sort({ periodNumber: -1 }).lean();
        res.status(200)
            .json({
                success: true,
                message: "All Periods fetched successfully",
                data: periods,
            })
    } catch (error) {
        next(error);
    }
}
export const closeBid = async (req, res, next) => {
    try {
        const { amount, color } = req.body;
        if (!amount || !color) return next(errorHandler(400, "Missing bid amount or color"));
        const currentPeriod = await PeriodModel.findOne({ status: 'open' }).sort({ periodNumber: -1 }).limit(1);
        const newBid = await BidModel.create({
            userId: new mongoose.Types.ObjectId(req.user._id),
            amount,
            color,
            periodId: new mongoose.Types.ObjectId(currentPeriod._id),
            status: "open",
            result: null
        });

        res.status(201)
            .json({
                success: true,
                message: "Bid placed successfully",
                data: newBid,
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
        if (!user.upiId) {
            return res.status(400).json({
                success: false,
                message: "Please add UPI ID",
            });
        }
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
export const getAllRequest = async (req, res, next) => {
    try {
        const allRequests = await RequestModel.find({}).sort({ updatedAt: -1 });

        res.status(200)
            .json({
                success: true,
                message: "All Requests fetched successfully",
                data: allRequests,
            })
    } catch (error) {
        next(error);
    }
}
export const acceptRequest = async (req, res, next) => {
    try {
        const requestId = req.body.requestId;
        const request = await RequestModel.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }
        const user = await UserModel.findById(request.userId);
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User who made the request not found",
            });
        }
        if (request.type === "withdraw") {
            if (user.walletBalance < request.amount) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient balance",
                });
            }
            user.walletBalance -= request.amount;
            await user.save();
            // Create a transaction document
            const newTransaction = new TransactionModel({
                userId: request.userId,
                amount: request.amount,
                type: 'withdraw'
            });
            await newTransaction.save();
        } else {
            user.walletBalance += request.amount;
            await user.save();
            // Create a transaction document
            const newTransaction = new TransactionModel({
                userId: request.userId,
                amount: request.amount,
                type: 'deposit'
            });
            await newTransaction.save();
        }

        // Update request status to accepted
        request.status = "accepted";
        await request.save();

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
