import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import User from "../models/users.js";
import { createUser, resetDatabase } from "./helpers.js";

describe("Auth", () => {
  beforeEach(resetDatabase);

  describe("POST /register", () => {
    it("creates a user with a hashed password", async () => {
      const res = await request(app)
        .post("/register")
        .send({ username: "new@example.com", password: "password123" });

      expect(res.status).to.equal(201);

      const user = await User.findOne({ username: "new@example.com" });
      expect(user).to.exist;
      expect(user!.passwordHash).to.not.equal("password123");
    });

    it("rejects a duplicate username", async () => {
      await createUser("taken@example.com");

      const res = await request(app)
        .post("/register")
        .send({ username: "taken@example.com", password: "password123" });

      expect(res.status).to.equal(400);
    });

    it("rejects a missing password", async () => {
      const res = await request(app)
        .post("/register")
        .send({ username: "new@example.com" });

      expect(res.status).to.equal(400);
    });
  });

  describe("POST /login", () => {
    it("returns a token for valid credentials", async () => {
      const token = await createUser();

      expect(token).to.be.a("string").and.not.be.empty;
    });

    it("rejects an incorrect password", async () => {
      await createUser("user@example.com");

      const res = await request(app)
        .post("/login")
        .send({ username: "user@example.com", password: "wrong-password" });

      expect(res.status).to.equal(404);
      expect(res.body).to.not.have.property("token");
    });

    it("rejects an unknown user", async () => {
      const res = await request(app)
        .post("/login")
        .send({ username: "nobody@example.com", password: "password123" });

      expect(res.status).to.equal(404);
    });
  });

  describe("GET /verify", () => {
    it("accepts a valid token", async () => {
      const token = await createUser();

      const res = await request(app)
        .get("/verify")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
    });

    it("rejects a missing token", async () => {
      const res = await request(app).get("/verify");

      expect(res.status).to.equal(403);
    });

    it("rejects an invalid token", async () => {
      const res = await request(app)
        .get("/verify")
        .set("Authorization", "Bearer not-a-real-token");

      expect(res.status).to.equal(403);
    });
  });
});
