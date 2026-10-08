import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import database from '../db.js';
import User from '../models/users.js';

export default async function register(req: Request, res: Response) {
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

        const exists = await User.exists({
            username: payload.username
        });

        if (exists) {
            return res.status(400).json({ message: "Already Registered - please log in." })
        }

        const saltingAmount = 10;
        const passwordHash = await bcrypt.hash(payload.password, saltingAmount);

        const created = await User.create({
            username: payload.username,
            passwordHash: passwordHash
        })

        if (created && created._id) {
            console.log("User created!", created._id);
            res.status(201).send("ok")
            return 
        }

        // If something went wrong
        res.status(500).json({
            message: 'Stuff happens'
        })
    } catch (error) {
        console.error(error)
        // If something went wrong
        res.status(500).json({
            message: 'Internal Error'
        })
    }
}