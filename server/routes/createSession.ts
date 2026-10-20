import type { Request, Response } from "express";
import verifyToken from "../middlewares/verifyJWT.js";
import Article from "../models/articles.js";
import Session from "../models/sessions.js";
import getDatabase from "../db/db.js";

export default async function createSession(req: Request, res: Response) {
  try {
    const userId = verifyToken(req);
    if (!userId) {
      return res.status(403).json({ message: "unauthorized" });
    }

    const payload = req.body as { slug?: unknown };

    if (!payload || typeof payload.slug !== "string") {
      return res
        .status(400)
        .json({ message: "Please provide an article slug." });
    }

    const database = await getDatabase();

    if (!database) {
      return res.status(500).json({ message: "Unable to connect to database" });
    }

    const exists = await Article.exists({ slug: payload.slug });

    if (!exists) {
      return res.status(404).json({ error: "Article not found!" });
    }

    const created = await Session.create({
      userId,
      slug: payload.slug,
      page: 1,
    });

    return res.status(201).json({ _id: created._id });
  } catch (error) {
    console.error(error);
    // If something went wrong
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}
