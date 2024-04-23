import { Server } from 'socket.io';
import PeriodModel from '../models/period.model.js';
import BidModel from '../models/bid.model.js';
import UserModel from '../models/user.model.js';

let io = null; // Socket.IO server instance
let currentPeriodTimeout;
let countdown = 30;
const startPeriodTimer = () => {
    currentPeriodTimeout = setInterval(() => {
        countdown -= 1;
        if (countdown <= 0) {
            countdown = 30;
        }
    }, 1000);
}
export const initializeSocket = (server) => {
    let isTimerRunning = false; // Track if the timer loop is running
    io = new Server(server, {
        cors: {
            origin: '*',
            credentials: true
        },
        // transports: ['websocket']
    });
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);
        if (!isTimerRunning) {
            isTimerRunning = true; // Set the flag to indicate that the timer loop should run
            const timerInterval = setInterval(async () => {
                console.log("🚀", countdown);
                io.emit('periodTimer', countdown);
                if (countdown === 30) {
                    io.emit('periodResult', await declareResult());
                }
            }, 1000);

            socket.on('disconnect', () => {
                console.log('Socket disconnected:', socket.id);
                if (io.sockets.sockets.size === 0) {
                    clearInterval(timerInterval); // Stop the timer loop if no clients are connected
                    isTimerRunning = false; // Reset the flag
                }
            });
        }
    });
    startPeriodTimer();
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO has not been initialized.');
    }
    return io;
}
const declareResult = async () => {
    try {
        let currentPeriod = await PeriodModel.findOne().sort({ periodNumber: -1 }).lean();
        console.log("🚀 ~ file: socketHandlers.js:50 ~ currentPeriod:", currentPeriod);

        if (!currentPeriod || currentPeriod.status !== 'open') {
            const newPeriod = await PeriodModel.create({
                periodNumber: (currentPeriod ? currentPeriod.periodNumber : 0) + 1,
                winners: [],
                losers: [],
                redAmount: 0,
                blueAmount: 0,
                result: "",
                status: 'open',
            });
            return {
                periodNumber: newPeriod.periodNumber || 0,
                winners: [],
                losers: []
            };
        }

        let winnersArr = [];
        let losersArr = [];

        // Determine the result of the current period
        currentPeriod.result = currentPeriod.blueAmount > currentPeriod.redAmount ? 'red' : (currentPeriod.redAmount > currentPeriod.blueAmount ? 'blue' : null);

        // Update bidders' statuses and users' wallet balances
        const currentBidders = await BidModel.find({ periodId: currentPeriod._id, status: 'open' }).lean();
        console.log("🚀 ~ file: socketHandlers.js:77 ~ currentBidders:", currentBidders);
        for (const bidder of currentBidders) {
            const update = {
                $set: {
                    result: bidder.color === currentPeriod.result ? 'win' : 'lose',
                    status: 'close'
                }
            };
            if (bidder.color === currentPeriod.result) {
                update.$inc = { walletBalance: parseInt(bidder.amount) * 2 };
                winnersArr.push(bidder.userId);
                console.log("🚀 ~ file: socketHandlers.js:91 ~ winnersArr:", winnersArr);
            } else {
                update.$inc = { walletBalance: -parseInt(bidder.amount) * 2 };
                losersArr.push(bidder.userId);
                console.log("🚀 ~ file: socketHandlers.js:91 ~ losersArr:", losersArr);
            }
            await BidModel.findByIdAndUpdate(bidder._id, update, { new: true });
            await UserModel.findByIdAndUpdate(bidder.userId, { $inc: update.$inc }, { new: true });
        }

        // Update period with result and close status
        await PeriodModel.findByIdAndUpdate(currentPeriod._id, { $set: { result: currentPeriod.result, status: 'close' } });

        console.log("🚀 ~ file: socketHandlers.js:130 ~ currentPeriod:", currentPeriod);

        return {
            periodNumber: currentPeriod.periodNumber,
            winners: winnersArr,
            losers: losersArr
        };

    } catch (error) {
        console.log("🚀 ~ file: socketHandlers.js:45 ~ error:", error);
        throw error; // Rethrow error for proper error handling in the caller function
    }
}
