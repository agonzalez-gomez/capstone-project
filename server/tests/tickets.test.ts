import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import Session from "../models/sessions.js";
import Ticket from "../models/tickets.js";
import { createArticle, createUser, resetDatabase } from "./helpers.js";

describe("Tickets", () => {
  let token: string;
  let sessionId: string;

  beforeEach(async () => {
    await resetDatabase();
    token = await createUser();
    await createArticle("test-article", 3);

    const res = await request(app)
      .post("/sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({ slug: "test-article" });
    sessionId = res.body._id;
  });

  const submitTicket = (body: object, authToken = token) =>
    request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${authToken}`)
      .send(body);

  describe("POST /tickets", () => {
    it("creates a ticket and marks the session unresolved", async () => {
      await Session.findByIdAndUpdate(sessionId, { resolved: true });

      const res = await submitTicket({
        sessionId,
        page: 3,
        description: "Still not working",
      });

      expect(res.status).to.equal(201);

      const ticket = await Ticket.findById(res.body._id);
      expect(ticket).to.include({
        slug: "test-article",
        page: 3,
        description: "Still not working",
        status: "open",
      });

      const session = await Session.findById(sessionId);
      expect(session).to.include({ page: 3, resolved: false });
    });

    it("rejects an empty description", async () => {
      const res = await submitTicket({
        sessionId,
        page: 1,
        description: "   ",
      });

      expect(res.status).to.equal(400);
    });

    it("rejects a description over the length limit", async () => {
      const res = await submitTicket({
        sessionId,
        page: 1,
        description: "a".repeat(2001),
      });

      expect(res.status).to.equal(400);
    });

    it("rejects a page past the end of the article", async () => {
      const res = await submitTicket({
        sessionId,
        page: 4,
        description: "Still not working",
      });

      expect(res.status).to.equal(400);
    });

    it("doesn't let users open tickets on someone else's session", async () => {
      const otherToken = await createUser("other@example.com");

      const res = await submitTicket(
        { sessionId, page: 1, description: "Still not working" },
        otherToken,
      );

      expect(res.status).to.equal(404);
      expect(await Ticket.countDocuments()).to.equal(0);
    });
  });

  describe("GET /tickets", () => {
    it("lists only the current user's tickets, newest first, with titles", async () => {
      await submitTicket({ sessionId, page: 1, description: "First" });
      await submitTicket({ sessionId, page: 2, description: "Second" });

      // Both tickets can share a timestamp, so backdate the first one
      await Ticket.collection.updateOne(
        { description: "First" },
        { $set: { createdAt: new Date(Date.now() - 60_000) } },
      );

      const otherToken = await createUser("other@example.com");
      const otherSession = await request(app)
        .post("/sessions")
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ slug: "test-article" });
      await submitTicket(
        { sessionId: otherSession.body._id, page: 1, description: "Other" },
        otherToken,
      );

      const res = await request(app)
        .get("/tickets")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(
        res.body.map((ticket: { description: string }) => ticket.description),
      ).to.deep.equal(["Second", "First"]);
      expect(res.body[0].articleTitle).to.equal("Article test-article");
      expect(res.body[0]).to.not.have.property("userId");
    });

    it("requires a token", async () => {
      const res = await request(app).get("/tickets");

      expect(res.status).to.equal(403);
    });
  });
});
