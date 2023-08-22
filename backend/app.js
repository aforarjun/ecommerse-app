import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import ErrorMiddleware from "./middlewares/error.js";

// *********Importing routes************
import user from "./routes/userRoutes.js";

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/test", (req, res) => {
  res.send("Hello world!");
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "config/.env",
  });
}


// ******* Creating route Apis ***********
app.use("/api/v2/user", user);

// For error handling
app.use(ErrorMiddleware);

export default app;
