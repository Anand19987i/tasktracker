import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config({});
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        })
    }
    const { name, email, password, country } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already resgistered",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            country,
        });

        await newUser.save();

        const token = jwt.sign({
            userId: newUser._id,
            email: newUser.email,
        }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: "User is registered successfully",
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                country: newUser.country
            }
        });

    } catch (err) {
        console.error('Signup error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            })
        }
        const token = jwt.sign({
            userId: user._id,
            email: user.email
        }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            success: true,
            message: "Login Successfull",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                country: user.country
            }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
}



