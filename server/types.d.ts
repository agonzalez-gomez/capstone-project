
import { ObjectId } from "mongodb";

declare global {
    type UserPayload = {
        username: string,
        password: string, 
    }



    type JWTPayload = {
        userId: string,
        username: string
    }


}