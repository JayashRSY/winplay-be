import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw', 'bid'],
        required: true
    }
}, { timestamps: true });


const TransactionModel = mongoose.model("Transaction", transactionSchema);
export default TransactionModel;