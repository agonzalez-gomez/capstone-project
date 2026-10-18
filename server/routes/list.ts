import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import verifyToken from "../middlewares/verifyJWT.js";
import Article from "../models/articles.js";
import getDatabase from "../db/db.js";

const PAGE_SIZE = 5;

export default async function list(req: Request, res: Response) {
  try {
    const userId = verifyToken(req);
    if (!userId) {
      return res.status(403).json({ message: "unauthorized" });
    }

    const params = req.query;

    const database = await getDatabase();

    if (!database) {
      return res.status(500).json({ message: "Unable to connect to database" });
    }

    const result = await Article.find(
      {},
      "category title subtitle slug",
    ).lean(); // Removes extras and returns "Clean" objects

    if (result && result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "No articles found!" });
    }
  } catch (error) {
    console.error(error);
    // If something went wrong
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}
