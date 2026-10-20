import type { Request, Response } from "express";
import verifyToken from "../middlewares/verifyJWT.js";
import Article from "../models/articles.js";
import Ticket from "../models/tickets.js";
import getDatabase from "../db/db.js";

export default async function listTickets(req: Request, res: Response) {
  try {
    const userId = verifyToken(req);
    if (!userId) {
      return res.status(403).json({ message: "unauthorized" });
    }

    const database = await getDatabase();

    if (!database) {
      return res.status(500).json({ message: "Unable to connect to database" });
    }

    const tickets = await Ticket.find(
      { userId },
      "slug page description status createdAt",
    )
      .sort({ createdAt: -1 })
      .lean();

    // Look up article titles so the list doesn't just show slugs
    const articles = await Article.find(
      { slug: { $in: tickets.map((ticket) => ticket.slug) } },
      "slug title",
    ).lean();

    const result = tickets.map((ticket) => ({
      ...ticket,
      articleTitle:
        articles.find((article) => article.slug === ticket.slug)?.title ??
        ticket.slug,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    // If something went wrong
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}
