import { model, Schema } from "mongoose";

export const MAX_COMMENT_LENGTH = 1000;

const SessionSchema = new Schema(
  {
    // _id: ObjectId,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      required: true,
      min: 1,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
      required: false,
      maxlength: MAX_COMMENT_LENGTH,
    },
  },
  { timestamps: true },
);

const Session = model("Session", SessionSchema);

export default Session;
