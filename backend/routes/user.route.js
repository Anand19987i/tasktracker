import { Router } from "express";
import { login, signUp } from "../controllers/user.controller.js";
import { body } from "express-validator";


const router = Router();

router.post('/signup', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required')
], signUp);

router.post('/login', login);

export default router;