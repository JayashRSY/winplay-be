import UserModel from "../models/user.model.js";
import { errorHandler } from "../utilities/error.js"

export const getAllUsers = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") return next(errorHandler(401, "Unauthorized"));

        const allUsers = await UserModel.find({}, '-password').sort({ updatedAt: -1 }).lean();
        res.status(200)
            .json({
                success: true,
                message: "Users fetched successfully",
                data: allUsers,
            })
    } catch (error) {
        next(error);
    }
}
export const getUserById = async (req, res, next) => {
    try {
        if (req.user !== "admin") return next(errorHandler(401, "Unauthorized"));
        const { id } = req.params;
        const user = await UserModel.findById(id, '-password').lean();
        if (!user) return next(errorHandler(404, `No user found with id: ${id}`));
        res.status(200)
            .json({
                success: true,
                message: "User fetched successfully",
                data: user,
            })
    } catch (error) {
        next(error);
    }
}
export const deleteUserById = async (req, res, next) => {
    try {
        if (req.user !== "admin") return next(errorHandler(401, "Unauthorized"));
        const { id } = req.params;
        const user = await UserModel.deleteDocumentById(id, 'username email role updatedAt createdAt').lean();
        if (!user) return next(errorHandler(404, `No user found with emailId: ${email}`));
        res.status(200)
            .json({
                success: true,
                message: "User deleted successfully",
                data: user,
            })
    } catch (error) {
        next(error);
    }
}
export const updateUserByEmail = async (req, res, next) => {
    try {
        if (req.user !== "admin") return next(errorHandler(401, "Unauthorized"));
        const { username, email, profilePicture, role } = req.body;

        const user = await UserModel.findOneAndUpdate(
            { email },
            { username, email, profilePicture, role },
            { new: true }
        );
        if (!user) return next(errorHandler(404, `No user found with email: ${email}`));
        res.status(200)
            .json({
                success: true,
                message: "User updated successfully",
                data: user,
            })
    } catch (error) {
        next(error);
    }
}
export const getUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id, '-password').lean();
        if (!user) return next(errorHandler(404, `No user found`));
        res.status(200)
            .json({
                success: true,
                message: "User fetched successfully",
                data: user,
            })
    } catch (error) {
        next(error);
    }
}