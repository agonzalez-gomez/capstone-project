import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import Article from "../models/articles.js";

export async function resetDatabase() {
  const collections = await mongoose.connection.db!.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}

// Registers and logs in a user, returning their token
export async function createUser(username = "user@example.com") {
  await request(app)
    .post("/register")
    .send({ username, password: "password123" });

  const res = await request(app)
    .post("/login")
    .send({ username, password: "password123" });

  return res.body.token as string;
}

export async function createArticle(slug = "test-article", pageCount = 3) {
  return Article.create({
    category: "Testing",
    title: `Article ${slug}`,
    slug,
    subtitle: "A test article",
    // Saved out of order to check the API sorts pages
    pages: Array.from({ length: pageCount }, (_, i) => ({
      title: `Page ${pageCount - i}`,
      content: "Test content",
      page: pageCount - i,
    })),
  });
}
