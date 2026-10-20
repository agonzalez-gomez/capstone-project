import express from "express";
import cors from "cors";
import login from "./routes/login.js";
import register from "./routes/register.js";
import verify from "./routes/verify.js";
import list from "./routes/list.js";
import article from "./routes/article.js";
import articleStats from "./routes/articleStats.js";
import createSession from "./routes/createSession.js";
import updateSession from "./routes/updateSession.js";
import createTicket from "./routes/createTicket.js";
import listTickets from "./routes/listTickets.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello world!"));

app.post("/register", register);
app.post("/login", login);
app.get("/verify", verify);
app.get("/articles", list);
app.get("/articles/:slug", article);
app.get("/articles/:slug/stats", articleStats);
app.post("/sessions", createSession);
app.patch("/sessions/:id", updateSession);
app.get("/tickets", listTickets);
app.post("/tickets", createTicket);

export default app;
