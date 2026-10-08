import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";

const UserSchema = new Schema(
    {
        // _id: ObjectId,
        username: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        }
    }
)

const User = model("User", UserSchema);

export default User;