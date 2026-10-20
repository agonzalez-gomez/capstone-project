import type { Request, Response } from "express";
import verifyToken from "../middlewares/verifyJWT.js";
import Session from "../models/sessions.js";
import getDatabase from "../db/db.js";

type StatsResult = {
  totals: {
    sessions: number;
    resolved: number;
    ratings: number;
    averageRating: number | null;
  }[];
  resolvedByPage: { _id: number; count: number }[];
};

export default async function articleStats(req: Request, res: Response) {
  try {
    const userId = verifyToken(req);
    if (!userId) {
      return res.status(403).json({ message: "unauthorized" });
    }

    const database = await getDatabase();

    if (!database) {
      return res.status(500).json({ message: "Unable to connect to database" });
    }

    // Only aggregate totals are returned - no user ids or comments
    const [result] = await Session.aggregate<StatsResult>([
      { $match: { slug: String(req.params.slug) } },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                sessions: { $sum: 1 },
                resolved: { $sum: { $cond: ["$resolved", 1, 0] } },
                ratings: {
                  $sum: { $cond: [{ $gt: ["$rating", null] }, 1, 0] },
                },
                averageRating: { $avg: "$rating" },
              },
            },
          ],
          resolvedByPage: [
            { $match: { resolved: true } },
            { $group: { _id: "$page", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    const totals = result?.totals[0];

    return res.status(200).json({
      sessions: totals?.sessions ?? 0,
      resolved: totals?.resolved ?? 0,
      ratings: totals?.ratings ?? 0,
      averageRating: totals?.averageRating ?? null,
      resolvedByPage: (result?.resolvedByPage ?? []).map((row) => ({
        page: row._id,
        count: row.count,
      })),
    });
  } catch (error) {
    console.error(error);
    // If something went wrong
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}
