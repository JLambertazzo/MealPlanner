import React, { useState } from "react";
import {
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  ListItemText,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { uid } from "react-uid";
import "./ReuseModal.css";
import { Ingredient, Meal } from "../../types/dbtypes";

interface Props {
  meals: Meal[];
  open: boolean;
  handleClose: () => void;
  handleSelect: (m: Meal) => void;
}

export default function ReuseModal(props: Props) {
  const [mealNum, setMealNum] = useState(0);
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      scroll="paper"
      aria-label="reuse previous meals"
    >
      <DialogTitle id="reuse-dialog-title">Select Meal</DialogTitle>
      <DialogContent dividers id="reuse-dialog-content">
        <List>
          {props.meals.map((meal) => {
            return (
              <ListItem
                key={uid(meal)}
                button
                onClick={() =>
                  props.handleSelect({ ...meal, mealNum: mealNum })
                }
                className="reuse-list-item"
              >
                <ListItemText
                  className="reuse-list-text"
                  primary={meal.name}
                  secondary={getMealSecondary(meal)}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <FormControl variant="filled">
          <InputLabel id="reuse-select-label" htmlFor="reuse-meal-select">
            Meal
          </InputLabel>
          <Select
            variant="outlined"
            id="reuse-meal-select"
            aria-labelledby="reuse-select-label"
            value={mealNum}
            onChange={(event) =>
              setMealNum(parseInt((event.target as HTMLInputElement).value))
            }
          >
            <MenuItem value={0}>Breakfast</MenuItem>
            <MenuItem value={1}>Lunch</MenuItem>
            <MenuItem value={2}>Dinner</MenuItem>
            <MenuItem value={3}>Snack</MenuItem>
          </Select>
        </FormControl>
        <Button
          id="reuse-meal-submit"
          onClick={props.handleClose}
          variant="contained"
          color="primary"
        >
          <Typography variant="body2">Close</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const getMealSecondary = (meal: Meal) => {
  return (
    <span>
      {meal.description}
      <br />
      ingredients:{" "}
      {meal.ingredients.reduce(
        (acc: string, curr: Ingredient, index: number) => {
          if (index > 2) {
            return acc;
          }
          return (acc = `${acc}${curr.name}, `);
        },
        ""
      )}
    </span>
  );
};
