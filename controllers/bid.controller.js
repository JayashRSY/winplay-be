import mongoose from "mongoose";
import RequestModel from "../models/request.model.js";
import UserModel from "../models/user.model.js";
import TransactionModel from "../models/transaction.model.js";
import BidModel from "../models/bid.model.js";
import PeriodModel from "../models/period.model.js";
import { errorHandler } from "../utilities/error.js"

export const createBid = async (req, res, next) => {
    try {
        const { amount, color } = req.body;
        if (!amount || !color) return next(errorHandler(400, "Missing bid amount or color"));

        const user = await UserModel.findById(req.user._id);
        if (!user || user.walletBalance < amount) return next(errorHandler(400, "Insufficient balance"));

        let currentPeriod = await PeriodModel.findOne().sort({ updatedAt: -1 });
        const isNewPeriod = !currentPeriod || currentPeriod.status === 'close';
        let newBid;

        if (isNewPeriod) {
            const newPeriod = await PeriodModel.create({
                periodNumber: isNewPeriod ? (currentPeriod ? currentPeriod.periodNumber + 1 : 1) : currentPeriod.periodNumber,
                winners: [],
                losers: [],
                redAmount: color === "red" ? amount : 0,
                blueAmount: color === "blue" ? amount : 0,
                result: "",
                status: 'open',
            });
            currentPeriod = newPeriod;
        } else {
            newBid = await BidModel.create({
                userId: req.user._id,
                amount,
                color,
                periodId: currentPeriod._id,
                status: "open",
                result: null
            });

            const updateField = color === "red" ? { redAmount: amount } : { blueAmount: amount };
            currentPeriod = await PeriodModel.findByIdAndUpdate(
                currentPeriod._id,
                { $inc: updateField },
                { new: true }
            );
        }

        user.walletBalance -= amount;
        await Promise.all([
            user.save(),
            TransactionModel.create({
                userId: req.user._id,
                amount: -amount,
                type: "bid"
            })
        ]);

        res.status(201).json({
            success: true,
            message: "Bid placed successfully",
            data: isNewPeriod ? undefined : newBid,
        });
    } catch (error) {
        next(error);
    }
};


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
            res.status(400).json({
                success: false,
                message: "Insufficient balance",
            });
        }
        if (!user.upiId) {
            res.status(400).json({
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
            res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }
        const user = await UserModel.findById(request.userId);
        if (!user) {
            res.status(500).json({
                success: false,
                message: "User who made the request not found",
            });
        }
        if (request.type === "withdraw") {
            if (user.walletBalance < request.amount) {
                res.status(400).json({
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
            res.status(404).json({
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
