"use strict";

import { Request, Response, NextFunction } from "express";
import { get, has } from "lodash";
import cors from "cors";
import mongoose from "./db/mongoose";
import MongoStore from "connect-mongo";

const log = console.log;

require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const session = require("express-session");

const validUrls = ["/", "/calendar", "/login", "/signup", "/profile"];
const authUrls = ["/calendar", "/profile"];
const unAuthUrls = ["/login", "/signup"];

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (!has(req, ["session", "user"]) && authUrls.includes(req.url)) {
    res.status(301).redirect("/signup");
  } else {
    next();
  }
};

const unauthenticate = (req: Request, res: Response, next: NextFunction) => {
  if (has(req, ["session", "user"]) && unAuthUrls.includes(req.url)) {
    res.status(301).redirect("/calendar");
  } else {
    next();
  }
};

function requireHTTPS(req: Request, res: Response, next: NextFunction) {
  // The 'x-forwarded-proto' check is for Heroku
  if (
    !req.secure &&
    req.get("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV !== "development"
  ) {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}

// set up body parse middleware and static folder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(
  cors({
    origin: "http://localhost:8081",
  })
);

app.use(
  session({
    secret: "a hardcoded secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 36000000,
      sameSite: "strict",
      httpOnly: true,
    },
    store: new MongoStore({ client: mongoose.connection.getClient() }),
    unset: "destroy",
  })
);

//api routes
app.use(require("./routes/api"));

app.get("/logout", (req: Request, res: Response) => {
  if (has(req, "session")) {
    get(req, "session").destroy((err: unknown) => {
      console.log(err);
    });
  }
  res.status(301).redirect("/");
});

app.get(
  "*",
  requireHTTPS,
  authenticate,
  unauthenticate,
  (req: Request, res: Response) => {
    if (!validUrls.includes(req.url)) {
      res.status(404).send("404 not found :(");
    }
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  }
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  log(`listening on port ${port}`);
});
