import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
    },
    upiId: {
        type: String,
    },
    walletBalance: {
        type: Number,
        default: 0,
    },
    referralCount: {
        type: Number,
        default: 0,
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-7.jpg",
    },
    role: {
        type: String,
        enum: ['user', 'artist', 'admin'],
        default: 'user'
    },
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;