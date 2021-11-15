import { Document, Model } from "mongoose";

export interface Ingredient {
  _id?: string;
  name: string;
  units: string;
  qty: number;
}

export interface Meal {
  _id?: string;
  name: string;
  date: string;
  mealNum: number;
  ingredients: Ingredient[];
  description: string;
}

export interface User {
  _id?: string;
  username: string;
  password: string;
  meals: Meal[];
  mealHistory: Meal[];
  ingredients: Ingredient[];
  ingredientHistory: string[];
  unitHistory: string[];
}

export interface UserDoc extends Document<User> {}

export interface UserModel extends Model<UserDoc> {}
