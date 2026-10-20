import type { Request, Response } from "express";
import verifyToken from "../middlewares/verifyJWT.js";
import Article from "../models/articles.js";
import getDatabase from "../db/db.js";

export default async function article(req: Request, res: Response) {
  try {
    const userId = verifyToken(req);
    if (!userId) {
      return res.status(403).json({ message: "unauthorized" });
    }

    const database = await getDatabase();

    if (!database) {
      return res.status(500).json({ message: "Unable to connect to database" });
    }

    const result = await Article.findOne({
      slug: String(req.params.slug),
    }).lean();

    if (result) {
      result.pages.sort((a, b) => a.page - b.page);
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "Article not found!" });
    }
  } catch (error) {
    console.error(error);
    // If something went wrong
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}
