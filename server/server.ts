import express from "express";
import cors from "cors";
import login from "./routes/login.js";
import register from "./routes/register.js";
import verify from "./routes/verify.js";
import list from "./routes/list.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello world!"));

app.post("/register", register);
app.post("/login", login);
app.get("/verify", verify);
app.get("/articles", list);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
