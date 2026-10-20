import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import verifyToken from "../middlewares/verifyJWT.js";
import Article from "../models/articles.js";
import Session from "../models/sessions.js";
import Ticket, { MAX_DESCRIPTION_LENGTH } from "../models/tickets.js";
import getDatabase from "../db/db.js";

export default async function createTicket(req: Request, res: Response) {
  try {
    const userId = verifyToken(req);
    if (!userId) {
      return res.status(403).json({ message: "unauthorized" });
    }

    const payload = (req.body ?? {}) as TicketPayload;

    if (
      typeof payload.sessionId !== "string" ||
      !isValidObjectId(payload.sessionId)
    ) {
      return res.status(400).json({ message: "Invalid session id." });
    }

    if (
      typeof payload.description !== "string" ||
      !payload.description.trim() ||
      payload.description.length > MAX_DESCRIPTION_LENGTH
    ) {
      return res.status(400).json({
        message: `Please describe the issue in ${MAX_DESCRIPTION_LENGTH} characters or less.`,
      });
    }

    const database = await getDatabase();

    if (!database) {
      return res.status(500).json({ message: "Unable to connect to database" });
    }

    // Users can only open tickets on their own sessions
    const session = await Session.findOne({ _id: payload.sessionId, userId });

    if (!session) {
      return res.status(404).json({ error: "Session not found!" });
    }

    const article = await Article.findOne(
      { slug: session.slug },
      "pages.page",
    ).lean();

    const page = Number(payload.page);

    if (
      !article ||
      !Number.isInteger(page) ||
      page < 1 ||
      page > article.pages.length
    ) {
      return res.status(400).json({ message: "Invalid page number." });
    }

    const created = await Ticket.create({
      userId,
      sessionId: session._id,
      slug: session.slug,
      page,
      description: payload.description.trim(),
    });

    session.page = page;
    session.resolved = false;
    await session.save();

    return res.status(201).json({ _id: created._id });
  } catch (error) {
    console.error(error);
    // If something went wrong
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}
