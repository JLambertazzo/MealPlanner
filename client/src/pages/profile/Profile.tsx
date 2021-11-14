import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../components/general/NavBar";
import {
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
} from "@mui/material";
import { DeleteOutlineRounded } from "@mui/icons-material";
import "./Profile.css";
import {
  getUserById,
  deleteMealHistory,
  deleteIngredientHistory,
} from "../../actions/actions";
import { Ingredient, Meal } from "../../types/dbtypes";
import { useFormControl } from "@mui/material";

interface Props {
  uid: string;
}

export default function Profile(props: Props) {
  const [username, setUsername] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firstRender = useRef(true);
  useEffect(() => {
    getData(props.uid, setUsername, setIngredients, setMeals, setIsLoading);
  }, [props.uid]);

  const handleDeleteMeal = (mid: string) => {
    deleteMealHistory(props.uid, mid).then(() =>
      getData(props.uid, setUsername, setIngredients, setMeals, setIsLoading)
    );
  };

  const handleDeleteIngredient = (ingredient: string) => {
    deleteIngredientHistory(props.uid, ingredient).then(() =>
      getData(props.uid, setUsername, setIngredients, setMeals, setIsLoading)
    );
  };

  return (
    <div id="profileWrapper">
      <NavBar uid={props.uid} />
      <div id="profileContent">
        <div id="profileLeft" className="profileInfo">
          <img src="favicon.ico" alt="temporary icon" />
          <Typography variant="h2">User: {username}</Typography>
          <Typography variant="body2">
            {isLoading ? "[loading...]" : meals.length} meals created
          </Typography>
          <Typography variant="body2">
            {isLoading ? "[loading...]" : ingredients.length} ingredients used
          </Typography>
        </div>
        <div id="profileRight" className="profileInfo">
          <div id="myMeals" className="tablediv">
            {/* @ts-ignore */}
            <TableContainer component="paper">
              <Table aria-label="Meal Table">
                <TableHead className="primaryBack">
                  <TableRow>
                    <TableCell>
                      <Typography variant="h3" color="secondary">
                        My Meals
                      </Typography>
                    </TableCell>
                    <TableCell component="td" aria-label="None" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? "Loading..."
                    : meals.map((meal, index) => {
                        return (
                          <TableRow className="row" key={index}>
                            <TableCell>
                              <Typography color="textPrimary">
                                {meal.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="delete meal"
                                className="delete-button"
                                onClick={() => handleDeleteMeal(meal._id || "")}
                              >
                                <DeleteOutlineRounded />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div id="myIngredients" className="tablediv">
            {/* @ts-ignore */}
            <TableContainer component="paper">
              <Table aria-label="Ingredient Table">
                <TableHead className="primaryBack">
                  <TableRow>
                    <TableCell>
                      <Typography variant="h3" color="secondary">
                        My Ingredients
                      </Typography>
                    </TableCell>
                    <TableCell component="td" aria-label="None" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? "Loading..."
                    : ingredients.map((name) => {
                        return (
                          <TableRow key={name} className="row">
                            <TableCell>
                              <Typography color="textPrimary">
                                {name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="delete ingredient"
                                className="delete-button"
                                onClick={() => handleDeleteIngredient(name)}
                              >
                                <DeleteOutlineRounded />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

const getData = (
  uid: string,
  setUsername: (u: string) => void,
  setIngredients: (i: string[]) => void,
  setMeals: (m: Meal[]) => void,
  setIsLoading: (b: boolean) => void
) => {
  setIsLoading(true);
  if (!uid) {
    setUsername("not found");
    setIngredients(["None"]);
    setMeals([
      {
        name: "None",
        date: new Date().toDateString(),
        mealNum: 0,
        description: "",
        ingredients: [],
      },
    ]);
    setIsLoading(false);
    return;
  }
  getUserById(uid).then((user) => {
    if (!user) {
      setUsername("not found");
      setIngredients(["None"]);
      setMeals([
        {
          name: "None",
          date: new Date().toDateString(),
          mealNum: 0,
          description: "",
          ingredients: [],
        },
      ]);
      setIsLoading(false);
      return;
    }
    console.log('our user', user)
    setUsername(user.username);
    if (user.mealHistory.length === 0) {
      setMeals([
        {
          name: "None",
          date: new Date().toDateString(),
          mealNum: 0,
          description: "",
          ingredients: [],
        },
      ]);
    } else {
      const mealHistory: Meal[] = [...user.mealHistory];
      setMeals(mealHistory);
    }
    if (user.ingredientHistory.length === 0) {
      setIngredients(["None"]);
    } else {
      const ingredientHistory: string[] = [...user.ingredientHistory];
      setIngredients(ingredientHistory);
    }
  });
  setIsLoading(false);
};
