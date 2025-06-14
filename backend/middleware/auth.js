import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({});

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "No token, access denied"
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}