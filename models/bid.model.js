import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    periodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Period',
        required: true
    },
    color: {
        type: String,
        enum: ['red', 'blue'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['open', 'close'],
        required: true,
        default: 'open'
    },
    result: {
        type: String,
        enum: ['win', 'lose', 'draw', null],
        default: null
    }
}, { timestamps: true });

const BidModel = mongoose.model('Bid', bidSchema);

export default BidModel;
