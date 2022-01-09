import React, { useState, FormEvent } from "react";
import Modal from "react-modal";
import {
  Select,
  FormControl,
  Button,
  TextField,
  MenuItem,
  Typography,
  InputLabel,
} from "@mui/material";
import { Close, ChevronLeft, Publish } from "@mui/icons-material";
import { addMeal, getIngredientNutriments } from "../../actions/actions";
import IngredientList from "../general/IngredientList";
import "./MealModal.css";
import { Ingredient } from "../../types/dbtypes";

interface Props {
  uid: string;
  isOpen: boolean;
  exit: () => void;
  showListModal: () => void;
  date: Date;
}

export default function MealModal(props: Props) {
  const [mealName, setMealName] = useState("");
  const [mealNum, setMealNum] = useState(0);
  const [ingredients, setIngredients] = useState([
    {
      name: "",
      units: "cup",
      qty: 0,
    },
  ]);
  const [description, setDescription] = useState("");

  Modal.setAppElement("#root");
  return (
    <Modal
      id="mealModal"
      isOpen={props.isOpen}
      onRequestClose={props.exit}
      onAfterClose={() =>
        handleClose(setMealName, setMealNum, setIngredients, setDescription)
      }
      contentLabel="Meal Modal"
    >
      <div className="modalHeader">
        <Typography variant="h2">
          Add a meal for {props.date.toDateString()}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ChevronLeft />}
          onClick={() => handleReturn(props)}
        >
          Return
        </Button>
      </div>
      <form
        id="mealModalForm"
        onSubmit={(event) =>
          handleSubmit(
            event,
            props,
            mealName,
            mealNum,
            ingredients,
            description
          )
        }
      >
        <FormControl className="input-field">
          {/* @ts-ignore TEST if we need this */}
          <TextField
            label="Meal Name"
            id="meal-name"
            // @ts-ignore TEST if we need this
            InputLabelProps={{ for: "meal-name" }}
            onChange={(event) => setMealName(event.target.value)}
            required
          />
        </FormControl>
        <FormControl className="input-field">
          <InputLabel htmlFor="mealSelect" id="select-label">
            For meal:
          </InputLabel>
          <Select
            defaultValue="0"
            name="mealNum"
            id="mealSelect"
            labelId="select-label"
            inputProps={{ "aria-labelledby": "select-label" }}
            onChange={(event) => setMealNum(parseInt(event.target.value) || 0)}
            required
          >
            <MenuItem value="0">Breakfast</MenuItem>
            <MenuItem value="1">Lunch</MenuItem>
            <MenuItem value="2">Dinner</MenuItem>
            <MenuItem value="3">Snack</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="input-field list-holder">
          <Typography variant="body1">Ingredients:</Typography>
          <IngredientList
            ingredients={ingredients}
            uid={props.uid}
            handleQtyChange={(event) =>
              handleIngredientQtyChange(event, ingredients, setIngredients)
            }
            handleUnitsChange={(event) =>
              handleIngredientUnitsChange(event, ingredients, setIngredients)
            }
            handleNameChange={(event) =>
              handleIngredientNameChange(event, ingredients, setIngredients)
            }
            removeIngredient={(index) =>
              removeIngredient(index, ingredients, setIngredients)
            }
          />
          <Button
            variant="contained"
            onClick={(event) =>
              handleAddIngredient(event, ingredients, setIngredients)
            }
          >
            Add Ingredient
          </Button>
        </FormControl>
        <FormControl className="input-field">
          <TextField
            label="Description"
            id="meal-description"
            //TODO InputLabelProps={{ for: "meal-description" }} Does it work fine without this??
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormControl>
        <div className="modalFooterButtons">
          <Button startIcon={<Publish />} type="submit" variant="contained">
            Submit
          </Button>
          <Button
            startIcon={<Close />}
            variant="contained"
            onClick={props.exit}
          >
            Cancel
          </Button>
          <Button startIcon={<Close />} variant="contained" onClick={test}>
            TEST
          </Button>
        </div>
      </form>
    </Modal>
  );
}

const test = () => {
  const ing = prompt("Enter Ingredient Name (no spaces)") || '';
  let data = {};
  getIngredientNutriments(ing)
    .then((res) => {
      data = {
        carbs: res.carbohydrates_100g + res.carbohydrates_unit,
        energy: res.energy_100g + res.energy_unit,
        fat: res.fat_100g + res.fat_unit,
        proteins: res.proteins_100g + res.proteins_unit,
        saturated_fat: res["saturated-fat_100g"] + res["saturated-fat_unit"],
        sodium: res.sodium_100g + res.sodium_unit,
        sugars: res.sugars_100g + res.sugars_unit,
      };
      console.table(data);
    })
    .catch(console.error);
};

const handleReturn = (props: Props) => {
  props.showListModal();
  props.exit();
};

const handleClose = (
  setMealName: (s: string) => void,
  setMealNum: (n: number) => void,
  setIngredients: (i: Ingredient[]) => void,
  setDescription: (s: string) => void
) => {
  setMealName("");
  setMealNum(0);
  setIngredients([{ name: "", units: "cup", qty: 0 }]);
  setDescription("");
};

const handleIngredientQtyChange = (
  event: FormEvent,
  ingredients: Ingredient[],
  setIngredients: (i: Ingredient[]) => void
) => {
  if ((event.target as HTMLInputElement).value === "") {

  }
  if (
    (event.target as HTMLInputElement).value !== "" &&
    (
      !(event.target as HTMLInputElement).value.match(/^\d+\.?\d*$/) ||
      parseFloat((event.target as HTMLInputElement).value) < 0
    )
  ) {
    event.preventDefault();
    return;
  }
  const index = parseInt(
    (
      event.target as HTMLInputElement
    ).parentElement?.parentElement?.parentElement?.getAttribute("index") || "-1"
  );
  if (index >= 0) {
    const newIngredients = [...ingredients];
    newIngredients[index].qty = parseFloat(
      (event.target as HTMLInputElement).value
    );
    setIngredients(newIngredients);
  }
};

const handleIngredientUnitsChange = (
  event: FormEvent,
  ingredients: Ingredient[],
  setIngredients: (i: Ingredient[]) => void
) => {
  const index = parseInt(
    (
      event.target as HTMLInputElement
    ).parentElement?.parentElement?.parentElement?.parentElement?.getAttribute("index") || "-1"
  );
  const newIngredients = [...ingredients];
  newIngredients[index].units = (event.target as HTMLInputElement).value;
  setIngredients(newIngredients);
};

const handleIngredientNameChange = (
  event: FormEvent,
  ingredients: Ingredient[],
  setIngredients: (i: Ingredient[]) => void
) => {
  const index = parseInt(
    (
      event.target as HTMLInputElement
    ).parentElement?.parentElement?.parentElement?.parentElement?.getAttribute(
      "index"
    ) || "-1"
  );
  const newIngredients = [...ingredients];
  newIngredients[index].name = (event.target as HTMLInputElement).value;
  setIngredients(newIngredients);
};

const handleAddIngredient = (
  event: FormEvent,
  ingredients: Ingredient[],
  setIngredients: (i: Ingredient[]) => void
) => {
  event.preventDefault();
  const newIngredients = [...ingredients, { name: "", units: "cup", qty: 0 }];
  setIngredients(newIngredients);
};

const handleSubmit = (
  event: FormEvent,
  props: Props,
  mealName: string,
  mealNum: number,
  ingredients: Ingredient[],
  description: string
) => {
  event.preventDefault();
  const validMealNum = mealNum || 0;
  // convert mealNum to number and call api
  const payload = {
    name: mealName,
    ingredients: ingredients.filter(
      (ingredient) => ingredient.name && ingredient.qty
    ),
    date: props.date.toString(),
    mealNum: validMealNum, //TODO test parseInt(validMealNum),
    description: description,
  };
  addMeal(payload, props.uid)
    .then(() => handleReturn(props))
    .catch((error) => console.log(error));
};

const removeIngredient = (
  index: number,
  ingredients: Ingredient[],
  setIngredients: (i: Ingredient[]) => void
) => {
  const newIngredients = [...ingredients];
  newIngredients.splice(index, 1);
  setIngredients(newIngredients);
};
