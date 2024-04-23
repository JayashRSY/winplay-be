import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
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
    paymentId: {
        type: String,
    },
    upiId: {
        type: String,
    },
    paymentDate: {
        type: Date,
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        required: true,
        default: 'pending'
    }
}, { timestamps: true });


const RequestModel = mongoose.model("Request", requestSchema);
export default RequestModel;