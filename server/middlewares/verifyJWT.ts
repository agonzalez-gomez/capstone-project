import type { Request } from "express";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;


export default function verifyToken(req: Request): false | string {

    // 1. Get token from the Authorization header
    const authHeader = req.headers['authorization'];
    
    // Headers typically look like: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return false;
    }
    if (!secret) {
        throw new Error("Missing secret")
    }

    try {
        // 2. Verify token signature and expiration
        const decoded = jwt.verify(token, secret) as JWTPayload;
        
        // 3. Attach user data from token payload to the request object
        return String(decoded.userId);
    } catch (error) {
        return false;
    }
    
}