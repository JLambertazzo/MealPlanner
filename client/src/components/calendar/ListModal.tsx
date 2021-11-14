import React, { useState } from "react";
import Modal from "react-modal";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ButtonGroup,
  Typography,
} from "@mui/material";
import { Add, Close, ExpandMore, Restore, Delete } from "@mui/icons-material";
import ReuseModal from "./ReuseModal";
import { getUserById, addMeal, deleteMeal } from "../../actions/actions";
import { uid } from "react-uid";
import "./ListModal.css";
import { Meal } from "../../types/dbtypes";

interface Props {
  uid: string;
  isOpen: boolean;
  exit: () => void;
  date: Date;
  showMealModal: () => void;
}

export default function ListModal(props: Props) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loadMeals, setLoadMeals] = useState<Meal[]>([]);
  const [showMeals, setShowMeals] = useState(false);

  return (
    <Modal
      id="listModal"
      isOpen={props.isOpen}
      onAfterOpen={() => getMeals(props, setMeals, setLoadMeals)}
      onRequestClose={props.exit}
      contentLabel="List Modal"
    >
      <div className="modalHeader">
        <Typography variant="h2">
          Meals for {props.date.toDateString()}:
        </Typography>
      </div>
      {getModalBody(props, meals, setShowMeals, setMeals, setLoadMeals)}
      <ReuseModal
        open={showMeals}
        handleClose={() => setShowMeals(false)}
        meals={loadMeals}
        handleSelect={(meal: Meal) =>
          reuseMeal(props, meal, setMeals, setLoadMeals)
        }
      />
    </Modal>
  );
}

const getModalBody = (
  props: Props,
  meals: Meal[],
  setShowMeals: (b: boolean) => void,
  setMeals: (meals: Meal[]) => void,
  setLoadMeals: (meals: Meal[]) => void
) => {
  if (meals.length === 0) {
    return (
      <div className="modalBody modalBodyEmpty">
        <ButtonGroup id="controlButtons" orientation="vertical">
          <Button
            variant="contained"
            onClick={() => showMealModal(props)}
            startIcon={<Add />}
          >
            New Meal
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowMeals(true)}
            startIcon={<Restore />}
          >
            Load Meal
          </Button>
          <Button
            variant="contained"
            onClick={props.exit}
            startIcon={<Close />}
          >
            Close
          </Button>
        </ButtonGroup>
      </div>
    );
  } else {
    return (
      <div className="modalBody">
        {meals.map((meal) => {
          return (
            <Accordion key={uid(meal)}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  {getMealText(meal.mealNum)} {meal.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="mealDetails">
                  <Typography variant="h6">Ingredients: </Typography>
                  <ul>
                    {meal.ingredients.map((ingredient) => {
                      return (
                        <li key={uid(ingredient)}>
                          {ingredient.qty} {ingredient.units} of{" "}
                          {ingredient.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="mealDetails">
                  <Typography variant="h6">Description:</Typography>
                  <ul>{meal.description}</ul>
                </div>
                <Button
                  onClick={() =>
                    handleDeleteMeal(props, meal._id, setMeals, setLoadMeals)
                  }
                  className="delete-button"
                  startIcon={<Delete />}
                  variant="contained"
                >
                  Delete
                </Button>
              </AccordionDetails>
            </Accordion>
          );
        })}
        <ButtonGroup id="controlButtons">
          <Button
            variant="contained"
            onClick={() => showMealModal(props)}
            startIcon={<Add />}
          >
            New Meal
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowMeals(true)}
            startIcon={<Restore />}
          >
            Load Meals
          </Button>
          <Button
            variant="contained"
            onClick={props.exit}
            startIcon={<Close />}
          >
            Close
          </Button>
        </ButtonGroup>
      </div>
    );
  }
};

const getMeals = (
  props: Props,
  setMeals: (meals: Meal[]) => void,
  setLoadMeals: (meals: Meal[]) => void
) => {
  if (!props.uid) {
    return;
  }
  getUserById(props.uid)
    .then((user) => {
      if (user) {
        const mealsToday = user.meals.filter((element: Meal) => {
          const mealDate = new Date(element.date);
          return mealDate.toDateString() === props.date.toDateString();
        });
        setLoadMeals(user.mealHistory);
        setMeals(mealsToday);
      }
    })
    .catch((error) => console.log(error));
};

const showMealModal = (props: Props) => {
  props.showMealModal();
  props.exit();
};

const getMealText = (mealNum: number) => {
  if (mealNum === 0) {
    return "Breakfast:";
  } else if (mealNum === 1) {
    return "Lunch:";
  } else if (mealNum === 2) {
    return "Dinner:";
  } else {
    return "Snack:";
  }
};

const reuseMeal = (
  props: Props,
  meal: Meal,
  setMeals: (meals: Meal[]) => void,
  setLoadMeals: (meals: Meal[]) => void
) => {
  //TODO test this pls
  //@ts-ignore
  const validNum = meal.mealNum === "" ? 1 : meal.mealNum;
  const payload = { ...meal, date: props.date.toDateString(), mealNum: validNum };
  addMeal(payload, props.uid)
    .then(() => {
      getMeals(props, setMeals, setLoadMeals);
    })
    .catch((error) => console.log(error));
};

const handleDeleteMeal = (
  props: Props,
  mid: string | undefined,
  setMeals: (meals: Meal[]) => void,
  setLoadMeals: (meals: Meal[]) => void
) => {
  deleteMeal(props.uid, mid || '').then((res) => {
    getMeals(props, setMeals, setLoadMeals);
  });
};
