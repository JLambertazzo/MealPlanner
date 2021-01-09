# MealPlanner
MealPlanner is a web app made to help you plan meals, which helps save time and money.

## Set Up

To set up this project and run it for yourself follow the steps below:
1. Clone this repo to a folder on your device.
2. Create a file in the repository named 'localdb'
3. Run the program using the following commands:
   1. `npm run-script setup`
   2. `mongod --dbpath localdb` (in a separate terminal)
   3. `npm run-script build-run`
4. The site should now be available locally on localhost:5000

## Usage

Starting from the home page (localhost:5000), click on the "Get Started" button which will take you to the sign in page if not logged in.  
Once there create an account and you will be redirected to the calendar view of the project, where most of the functionality is. Once here the following actions are available to you:
1. Select any date on the calendar to view meals set for that date.
   1. Click on the new meal button to create a new meal for that day
2. Click on Generate Shopping List to generate your shopping list of needed ingredients based on the ingredients needed for your meals, and the ingredients you already have.
   1. Export the list by copying it, printing it, or emailing it
3. Click on Ingredients List to set the ingredients you already have. These will be removed from the shopping list

## API Routes

* **GET** /api/checkloggedin
   * Check if a user is currently logged in
   * Expects no body
   * Returns id of current user or 401 if not logged in
* **GET** /api/users/:id
   * Get user by id
   * Expects no body
   * Returns user object if found, 404 otherwise
* **POST** /api/users
   * Create new user
   * Expects:
   ```json
   {
     "username": "username",
     "password": "password"
   }
   ```
   * Returns user object on success
* **POST** /api/login
   * Logs a user in
   * Expects:
   ```json
   {
     "username": "username",
     "password": "password"
   }
   ```
   * Returns user logged in on success
* **POST** /api/users/:id/meals
   * Adds a meal for user (id)
   * Expects:
   ```json
   {
     "name": "meal name",
     "ingredients": [{ "name": "ingredient name", "qty": number }],
     "date": "date string",
     "mealNum": number (0-3),
     "description": "description of meal"
   }
   ```
   * Returns user with new meal on success
* **POST** /api/users/:id/ingredients
   * Sets a user's ingredients list
   * Expects:
   ```json
   {
     "ingredients": [{
       "name": "ingredient name",
       "qty": number
     }]
   }
   ```
   * Returns user with updated ingredients on success
* **DELETE** /api/users/:id/meals/:mealId
   * Deletes a user's meal
   * Expects no body
   * Returns updated user object on success
* **DELETE** /api/users/:id/ingredients/:ingredientId
   * Deletes a user's ingredient
   * Expects no body
   * Returns updated user on success

## Technologies Used

* Node.js - backend/running server
* Expressjs - MealPlanner api
* Mongoose - Schemas for MongoDB
* MongoDB - Database for users, meals, ingredients
* React
* Material-UI
* HTML/CSS/JavaScript