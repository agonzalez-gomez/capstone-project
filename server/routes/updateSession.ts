import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import verifyToken from "../middlewares/verifyJWT.js";
import Article from "../models/articles.js";
import Session, { MAX_COMMENT_LENGTH } from "../models/sessions.js";
import getDatabase from "../db/db.js";

export default async function updateSession(req: Request, res: Response) {
  try {
    const userId = verifyToken(req);
    if (!userId) {
      return res.status(403).json({ message: "unauthorized" });
    }

    const sessionId = String(req.params.id);
    const payload = (req.body ?? {}) as SessionUpdatePayload;

    if (!isValidObjectId(sessionId)) {
      return res.status(400).json({ message: "Invalid session id." });
    }

    if (
      payload.resolved !== undefined &&
      typeof payload.resolved !== "boolean"
    ) {
      return res
        .status(400)
        .json({ message: "Resolved must be true or false." });
    }

    if (
      payload.rating !== undefined &&
      (!Number.isInteger(payload.rating) ||
        Number(payload.rating) < 1 ||
        Number(payload.rating) > 5)
    ) {
      return res.status(400).json({ message: "Rating must be 1 to 5." });
    }

    if (
      payload.comments !== undefined &&
      (typeof payload.comments !== "string" ||
        payload.comments.length > MAX_COMMENT_LENGTH)
    ) {
      return res.status(400).json({
        message: `Comments must be ${MAX_COMMENT_LENGTH} characters or less.`,
      });
    }

    const database = await getDatabase();

    if (!database) {
      return res.status(500).json({ message: "Unable to connect to database" });
    }

    // Users can only update their own sessions
    const session = await Session.findOne({ _id: sessionId, userId });

    if (!session) {
      return res.status(404).json({ error: "Session not found!" });
    }

    if (payload.page !== undefined) {
      const article = await Article.findOne(
        { slug: session.slug },
        "pages.page",
      ).lean();

      if (
        !article ||
        !Number.isInteger(payload.page) ||
        Number(payload.page) < 1 ||
        Number(payload.page) > article.pages.length
      ) {
        return res.status(400).json({ message: "Invalid page number." });
      }

      session.page = payload.page;
    }

    if (payload.resolved !== undefined) session.resolved = payload.resolved;
    if (payload.rating !== undefined) session.rating = payload.rating;
    if (payload.comments !== undefined) session.comments = payload.comments;

    await session.save();

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    // If something went wrong
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}
