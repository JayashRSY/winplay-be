import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(errorHandler(401, 'Unauthorized: No token provided'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(403, 'Forbidden: Invalid token'));
        }
        req.user = user;
        next();
    });
}
