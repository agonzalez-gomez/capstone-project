import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Article from "../models/articles.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

type SeedArticle = {
  category: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  pages: {
    title: string;
    imgURL?: string;
    content: string;
    page: number;
  }[];
};

async function seedArticles() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI must be set in server/.env");
  }

  const articles = JSON.parse(
    await readFile(new URL("./articles.json", import.meta.url), "utf8"),
  ) as SeedArticle[];

  await mongoose.connect(
    mongoUri,
    process.env.DB_NAME ? { dbName: process.env.DB_NAME } : {},
  );

  try {
    const result = await Article.bulkWrite(
      articles.map((article) => ({
        updateOne: {
          filter: { slug: article.slug },
          update: { $set: article },
          upsert: true,
        },
      })),
    );

    console.log(
      `Seeded ${result.upsertedCount} new and ${result.modifiedCount} updated articles.`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

seedArticles().catch((error: unknown) => {
  console.error("Failed to seed articles:", error);
  process.exitCode = 1;
});
