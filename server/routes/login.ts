import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import database from '../db.js';
import User from '../models/users.js';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export default async function login(req: Request, res: Response) {
    try {
        // Get the JSON payload
        const payload = req.body as UserPayload;

        if (!payload || !payload.username || !payload.password) {
            return res.status(400).json({
                message: "There was an error. Please provide username and password."
            })
        }

        if (!database) {
            return res.status(500).json({ message: "Unable to connect to database" })
        }
    

        const userDoc = await User.findOne({
            username: payload.username,
        });

        if (!userDoc || !userDoc._id) {
            return res.status(404).json({ message: "Incorrect username or password. You figure it out." })
        }

        if (!secret) {
            throw new Error("Missing secret")
        }

        const isPasswordValid = await bcrypt.compare(payload.password, userDoc.passwordHash)

        if (!isPasswordValid) {
            return res.status(404).json({ message: "Incorrect username or password. You figure it out." })
        }

        const jwtpayload: JWTPayload = { userId: userDoc._id.toString(), username: userDoc.username };

        const token = jwt.sign(jwtpayload, secret, { expiresIn: '1h' });

        return res.json({ token, message: "Login successful"})

        // // 3. Generate JWT Payload
        // const payload = { userId: user._id, email: user.email };

        // // 4. Sign Token (Expires in 1 hour)
        // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // // 5. Send token to client
        // res.json({ token, message: 'Login successful' });

        // If something went wrong
       
    } catch (error) {
        console.error(error)
        // If something went wrong
        res.status(500).json({
            message: 'Internal Error'
        })
    }
}