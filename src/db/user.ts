"use strict";

import { NextFunction } from "express";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ingredientsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  units: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
});

const MealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  mealNum: {
    type: Number,
    required: true,
  },
  ingredients: {
    type: [ingredientsSchema],
    required: true,
  },
  description: String,
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  meals: [MealSchema],
  mealHistory: [MealSchema],
  ingredients: [ingredientsSchema],
  ingredientHistory: [String],
  unitHistory: [String],
});

UserSchema.pre("save", function (next: NextFunction) {
  //@ts-ignore
  const user = this;

  // checks to ensure we don't hash password more than once
  if (user.isModified("password")) {
    // generate salt and hash the password
    bcrypt.hash(user.password, 10, (err: any, hash: string) => {
      if (err) {
        console.log(err);
        return false;
      }
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
