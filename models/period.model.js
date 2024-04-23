import mongoose from 'mongoose';

const periodSchema = new mongoose.Schema({
    periodNumber: {
        type: Number,
        required: true,
        // unique: true,
    },
    winners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    losers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    redAmount: { type: Number, default: 0 },
    blueAmount: { type: Number, default: 0 },
    result: { type: String },
    status: {
        type: String,
        enum: ['open', 'close'],
        default: 'open',
    },
}, { timestamps: true });

const PeriodModel = mongoose.model('Period', periodSchema);

export default PeriodModel;
