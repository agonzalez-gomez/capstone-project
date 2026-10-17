import type { Request, Response } from "express"
import verifyToken from "../middlewares/verifyJWT.js"


export default async function register(req: Request, res: Response) {
    try {

        const userId = verifyToken(req);
        if (!userId) {
            res.status(403).json({message:'unauthorized'})
        }

    }
    catch (error) {
        console.error(error)
        // If something went wrong
        res.status(500).json({
            message: 'Internal Error'
        })
    }
}