import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Express configuration
app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended:true, limit:"20kb"}));
app.use(express.static("public"));
app.use(cookieParser());
// Express configuration

// Routes Import
// Routes Import

// Routes Declarations
// Routes Declarations

export {app};