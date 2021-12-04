import { NextFunction, Request, Response } from "express";

const { log } = console;
const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const { ObjectID } = require("mongodb");
const bodyParse = require("body-parser");
const { mongoose } = require("../db/mongoose");
const { User } = require("../db/user");

import session from "express-session";
import { Document, Model, Error } from "mongoose";
import { Ingredient, Meal, User as UserType } from "../types/dbtypes";
import { isDefaultMeasurement } from "../utils/units";

declare module "express-session" {
  export interface SessionData {
    user: UserType;
  }
}

router.use(bodyParse.json());

const a = 3;

function isMongoError(error: Error) {
  return (
    typeof error === "object" &&
    error !== null &&
    error.name === "MongoNetworkError"
  );
}

const mongoChecker = (req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return false;
  }
  next();
};

const idChecker = async (req: Request, res: Response, next: NextFunction) => {
  if (!ObjectID.isValid(req.params.id)) {
    log("invalid user id:", req.params.id);
    res.status(404).send();
    return;
  }
  next();
};

const mealIdChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!ObjectID.isValid(req.params.mealId)) {
    log("invalid meal id");
    res.status(404).send();
    return;
  }
  next();
};

// check if a user is currently logged in
router.get("/api/checkloggedin", (req: Request, res: Response) => {
  if (req.session.user) {
    res.send({ uid: req.session.user });
  } else {
    res.status(401).send();
  }
});

// get user by id
router.get(
  "/api/users/:id",
  mongoChecker,
  idChecker,
  (req: Request, res: Response) => {
    User.findById(req.params.id)
      .then((result: UserType) => {
        if (result) {
          res.send(result);
        } else {
          res.status(404).send();
        }
      })
      .catch((error: Error) => {
        log(error);
        if (isMongoError(error)) {
          res.status(500).send("internal server error");
        } else {
          res.status(400).send("bad request");
        }
      });
  }
);

// create user
// expects:
// {
//   username: 'username',
//   password: 'password'
// }
router.post("/api/users", mongoChecker, async (req: Request, res: Response) => {
  if (process.env.BLOCK_SIGNUP) {
    res.status(401).send("Signup Not Allowed Curerntly :(");
  } else {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      meals: [],
      mealHistory: [],
      ingredients: [],
      ingredientHistory: [],
      unitHistory: [],
    });
    try {
      const otherUsers = await User.findOne({ username: req.body.username });
      if (otherUsers) {
        res.status(400).send("username already taken");
      } else {
        const result = await user.save();
        res.send(result);
      }
    } catch (error) {
      log(error);
      if (isMongoError(error as Error)) {
        res.status(500).send("internal server error");
      } else {
        res.status(400).send("bad request");
      }
    }
  }
});

// login user
// expects:
// {
//   username: 'username',
//   password: 'password'
// }
router.post("/api/login", mongoChecker, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      req.session.user = user._id;
      res.send(user);
    } else if (user) {
      res.status(401).send("forbidden");
    } else {
      res.status(404).send("resource not found");
    }
  } catch (error) {
    log(error);
    if (isMongoError(error as Error)) {
      res.status(500).send("internal server error");
    } else {
      res.status(400).send("bad request");
    }
  }
});

// Add meal
// expects:
// {
//   name: 'meal name',
//   ingredients: [{ name: 'name', units: 'units', qty: qty }],
//   date: 'date string',
//   mealNum: num,
//   description: 'description of meal' // optional
// }
router.post(
  "/api/users/:id/meals",
  mongoChecker,
  idChecker,
  (req: Request, res: Response) => {
    const ingredients: Ingredient[] = [];
    req.body.ingredients.forEach((element: Ingredient) => {
      ingredients.push({
        name: element.name,
        units: element.units,
        qty: element.qty,
      });
    });
    const meal = {
      name: req.body.name,
      ingredients: req.body.ingredients,
      date: req.body.date,
      mealNum: req.body.mealNum,
      description: req.body.description || "",
    };
    User.findById(req.params.id)
      .then((result: UserType) => {
        if (result) {
          if (
            !result.meals.find(
              (resMeal) =>
                resMeal.name === meal.name &&
                sameIngredients(meal.ingredients, resMeal.ingredients)
            )
          ) {
            result.mealHistory.push(meal);
          }
          ingredients.forEach((ingredient) => {
            if (!result.ingredientHistory.includes(ingredient.name)) {
              result.ingredientHistory.push(ingredient.name);
            }
            if (!result.unitHistory.includes(ingredient.units) && !isDefaultMeasurement(ingredient.units)) {
              result.unitHistory.push(ingredient.units);
            }
          });
          result.meals.push(meal);
          // TODO figure out mongoose types
          // @ts-ignore
          result.save();
          res.send(result);
        } else {
          res.status(404).send("resource not found");
        }
      })
      .catch((error: Error) => {
        log(error);
        if (isMongoError(error)) {
          res.status(500).send("internal server error");
        } else {
          res.status(400).send("bad request");
        }
      });
  }
);

// helper function for adding to history
const sameIngredients = (
  ingredients: Ingredient[],
  resIngredients: Ingredient[]
) => {
  ingredients.forEach((ingredient, index) => {
    if (
      !resIngredients[index] ||
      ingredient.name !== resIngredients[index].name ||
      ingredient.qty !== resIngredients[index].qty ||
      ingredient.units !== resIngredients[index].units
    ) {
      return false;
    }
  });
  return true;
};

// Set ingredients
// expects:
// {
//   ingredients: [{
//     name: 'ingredient name',
//     units: 'units',
//     qty: number
//   }]
// }
router.patch(
  "/api/users/:id/ingredients",
  mongoChecker,
  idChecker,
  (req: Request, res: Response) => {
    console.log('YOU HAVE', req.body.ingredients)
    User.findByIdAndUpdate(req.params.id, {
      $set: { ingredients: req.body.ingredients },
    })
      .then((result: UserType) => {
        if (result) {
          req.body.ingredients.forEach((ingredient: Ingredient) => {
            if (!result.ingredientHistory.includes(ingredient.name)) {
              result.ingredientHistory.push(ingredient.name);
            }
            if (!result.unitHistory.includes(ingredient.units) && !isDefaultMeasurement(ingredient.units)) {
              result.unitHistory.push(ingredient.units);
            }
          });
          //@ts-ignore HERE TOO
          result.save();
          res.send(result);
        } else {
          res.status(404).send("resource not found");
        }
      })
      .catch((error: Error) => {
        log(error);
        if (isMongoError(error)) {
          res.status(500).send("internal server error");
        } else {
          res.status(400).send("bad request");
        }
      });
  }
);

// Delete meal by mealId
router.delete(
  "/api/users/:id/meals/:mealId",
  mongoChecker,
  idChecker,
  mealIdChecker,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).send("resource not found");
        return;
      }
      const meal = user.meals.id(req.params.mealId);
      if (!meal) {
        res.status(404).send("resource not found");
        return;
      }
      user.meals = user.meals.filter(
        (element: Meal) => element._id?.toString() !== req.params.mealId
      );
      await user.save();
      res.send(user);
    } catch (error) {
      log(error);
      if (isMongoError(error as Error)) {
        res.status(500).send("internal server error");
      } else {
        res.status(400).send("bad request");
      }
    }
  }
);

// Delete meal by mealId from mealhistory
router.delete(
  "/api/users/:id/mealHistory/:mealId",
  mongoChecker,
  idChecker,
  mealIdChecker,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).send("resource not found");
        return;
      }
      const meal = user.mealHistory.id(req.params.mealId);
      if (!meal) {
        res.status(404).send("resource not found");
        return;
      }
      user.mealHistory = user.mealHistory.filter(
        (element: Meal) => element._id?.toString() !== req.params.mealId
      );
      await user.save();
      res.send(user);
    } catch (error) {
      log(error);
      if (isMongoError(error as Error)) {
        res.status(500).send("internal server error");
      } else {
        res.status(400).send("bad request");
      }
    }
  }
);

// Delete ingredient from ingredienthistory
router.delete(
  "/api/users/:id/ingredientHistory/:ingredient",
  mongoChecker,
  idChecker,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).send("resource not found");
        return;
      }
      user.ingredientHistory = user.ingredientHistory.filter(
        (element: string) => element !== req.params.ingredient
      );
      await user.save();
      res.send(user);
    } catch (error) {
      log(error);
      if (isMongoError(error as Error)) {
        res.status(500).send("internal server error");
      } else {
        res.status(400).send("bad request");
      }
    }
  }
);

module.exports = router;
