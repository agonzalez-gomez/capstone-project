import { model, Schema } from "mongoose";

export const MAX_DESCRIPTION_LENGTH = 2000;

const TicketSchema = new Schema(
  {
    // _id: ObjectId,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
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
    description: {
      type: String,
      required: true,
      maxlength: MAX_DESCRIPTION_LENGTH,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true },
);

const Ticket = model("Ticket", TicketSchema);

export default Ticket;
