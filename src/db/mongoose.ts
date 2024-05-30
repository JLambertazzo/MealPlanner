// holds connection to mongo server
// const mongoose = require("mongoose");
import mongoose from "mongoose";
const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/MealPlanner";

mongoose.connect(mongoURI, {
  //@ts-ignore
  useUnifiedTopology: true,
});

export default mongoose;
