import { expect } from "chai";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import Session from "../models/sessions.js";
import { createArticle, createUser, resetDatabase } from "./helpers.js";

describe("Articles", () => {
  let token: string;

  beforeEach(async () => {
    await resetDatabase();
    token = await createUser();
  });

  describe("GET /articles", () => {
    it("requires a token", async () => {
      const res = await request(app).get("/articles");

      expect(res.status).to.equal(403);
    });

    it("lists articles without their pages", async () => {
      await createArticle("first");
      await createArticle("second");

      const res = await request(app)
        .get("/articles")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);
      expect(res.body[0]).to.include.keys("title", "slug", "category");
      expect(res.body[0]).to.not.have.property("pages");
    });
  });

  describe("GET /articles/:slug", () => {
    it("returns the article with pages in order", async () => {
      await createArticle("ordered", 3);

      const res = await request(app)
        .get("/articles/ordered")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(
        res.body.pages.map((page: { page: number }) => page.page),
      ).to.deep.equal([1, 2, 3]);
    });

    it("returns 404 for an unknown slug", async () => {
      const res = await request(app)
        .get("/articles/missing")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(404);
    });
  });

  describe("GET /articles/:slug/stats", () => {
    it("returns zeros when there are no sessions", async () => {
      await createArticle("unused");

      const res = await request(app)
        .get("/articles/unused/stats")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        sessions: 0,
        resolved: 0,
        ratings: 0,
        averageRating: null,
        resolvedByPage: [],
      });
    });

    it("aggregates sessions without exposing user data", async () => {
      await createArticle("popular");
      const userId = new mongoose.Types.ObjectId();

      await Session.create([
        { userId, slug: "popular", page: 1, resolved: true, rating: 5 },
        { userId, slug: "popular", page: 2, resolved: true, rating: 3 },
        { userId, slug: "popular", page: 2, resolved: true },
        { userId, slug: "popular", page: 3, resolved: false },
        { userId, slug: "other", page: 1, resolved: true, rating: 1 },
      ]);

      const res = await request(app)
        .get("/articles/popular/stats")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        sessions: 4,
        resolved: 3,
        ratings: 2,
        averageRating: 4,
        resolvedByPage: [
          { page: 1, count: 1 },
          { page: 2, count: 2 },
        ],
      });
    });
  });
});
