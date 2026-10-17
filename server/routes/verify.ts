import { type Request, type Response } from 'express';
import verifyToken from '../middlewares/verifyJWT.js';
import getDatabase from '../db/db.js';

const secret = process.env.JWT_SECRET;

export default async function verify(req: Request, res: Response) {
    try {
        const database = await getDatabase()
        
        if (!database) {
            return res.status(500).json({ message: "Unable to connect to database" })
        }

        const userId = verifyToken(req);
        if (!userId) {
            return res.status(403).json({message:'unauthorized'})
        }

        return res.sendStatus(200);
       
    } catch (error) {
        console.error(error)
        // If something went wrong
        res.status(500).json({
            message: 'Internal Error'
        })
    }
}