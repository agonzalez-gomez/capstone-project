import { expect } from "chai";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import Session from "../models/sessions.js";
import { createArticle, createUser, resetDatabase } from "./helpers.js";

describe("Sessions", () => {
  let token: string;

  beforeEach(async () => {
    await resetDatabase();
    token = await createUser();
    await createArticle("test-article", 3);
  });

  const startSession = async (authToken = token) => {
    const res = await request(app)
      .post("/sessions")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ slug: "test-article" });

    return res.body._id as string;
  };

  describe("POST /sessions", () => {
    it("starts a session on page 1", async () => {
      const id = await startSession();

      const session = await Session.findById(id);
      expect(session).to.exist;
      expect(session!.page).to.equal(1);
      expect(session!.resolved).to.equal(false);
    });

    it("requires a token", async () => {
      const res = await request(app)
        .post("/sessions")
        .send({ slug: "test-article" });

      expect(res.status).to.equal(403);
    });

    it("returns 404 for an unknown article", async () => {
      const res = await request(app)
        .post("/sessions")
        .set("Authorization", `Bearer ${token}`)
        .send({ slug: "missing" });

      expect(res.status).to.equal(404);
    });

    it("rejects a missing slug", async () => {
      const res = await request(app)
        .post("/sessions")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(res.status).to.equal(400);
    });
  });

  describe("PATCH /sessions/:id", () => {
    it("updates the page", async () => {
      const id = await startSession();

      const res = await request(app)
        .patch(`/sessions/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ page: 2 });

      expect(res.status).to.equal(200);
      expect((await Session.findById(id))!.page).to.equal(2);
    });

    it("saves feedback", async () => {
      const id = await startSession();

      const res = await request(app)
        .patch(`/sessions/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ page: 3, resolved: true, rating: 4, comments: "Helpful" });

      expect(res.status).to.equal(200);

      const session = await Session.findById(id);
      expect(session).to.include({
        page: 3,
        resolved: true,
        rating: 4,
        comments: "Helpful",
      });
    });

    it("rejects a page past the end of the article", async () => {
      const id = await startSession();

      const res = await request(app)
        .patch(`/sessions/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ page: 4 });

      expect(res.status).to.equal(400);
    });

    it("rejects a rating outside 1-5", async () => {
      const id = await startSession();

      for (const rating of [0, 6, 2.5]) {
        const res = await request(app)
          .patch(`/sessions/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ rating });

        expect(res.status, `rating ${rating}`).to.equal(400);
      }
    });

    it("rejects comments over the length limit", async () => {
      const id = await startSession();

      const res = await request(app)
        .patch(`/sessions/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ comments: "a".repeat(1001) });

      expect(res.status).to.equal(400);
    });

    it("rejects an invalid session id", async () => {
      const res = await request(app)
        .patch("/sessions/not-an-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ page: 2 });

      expect(res.status).to.equal(400);
    });

    it("returns 404 for a session that doesn't exist", async () => {
      const res = await request(app)
        .patch(`/sessions/${new mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ page: 2 });

      expect(res.status).to.equal(404);
    });

    it("doesn't let users update someone else's session", async () => {
      const id = await startSession();
      const otherToken = await createUser("other@example.com");

      const res = await request(app)
        .patch(`/sessions/${id}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ page: 2 });

      expect(res.status).to.equal(404);
      expect((await Session.findById(id))!.page).to.equal(1);
    });
  });
});
