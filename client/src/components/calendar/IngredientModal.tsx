import React, { FormEvent, useState } from "react";
import Modal from "react-modal";
import { getUserById, setUserIngredients } from "../../actions/actions";
import {
  Button,
  Typography,
  Snackbar,
  SnackbarContent,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import {
  Save,
  Add,
  ChevronLeft,
  ErrorOutline,
  Close,
  CheckCircleOutline,
} from "@material-ui/icons";
import IngredientList from "../general/IngredientList";
import "./IngredientModal.css";
import { Ingredient } from "../../types/dbtypes";

interface Props {
  uid: string;
  isOpen: boolean;
  exit: () => void;
}

export default function IngredientModal(props: Props) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", units: "cup", qty: 0 },
  ]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const classes = useStyles();
  return (
    <Modal
      id="ingredientModal"
      isOpen={props.isOpen}
      onAfterOpen={() => getData(props, setIngredients)}
      onRequestClose={props.exit}
      onAfterClose={() => afterClose(setIngredients)}
      contentLabel="Ingredients Modal"
    >
      <div className="modalHeader">
        <Typography variant="h2">My Ingredients:</Typography>
        <Button
          onClick={props.exit}
          variant="contained"
          startIcon={<ChevronLeft />}
        >
          Return
        </Button>
      </div>
      <div className="list-holder">
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
          startIcon={<Add />}
          onClick={(event) =>
            handleAddIngredient(event, ingredients, setIngredients)
          }
        >
          Add Ingredient
        </Button>
        <Button
          id="saveButton"
          variant="contained"
          startIcon={<Save />}
          onClick={() =>
            saveData(props, ingredients, setSuccessOpen, setErrorOpen)
          }
        >
          Save Data
        </Button>
        <Snackbar
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          autoHideDuration={4000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <SnackbarContent
            message={
              <Typography variant="body1">
                <CheckCircleOutline className={classes.snackbarIcon} />
                Successfully Saved Ingredients...
              </Typography>
            }
            action={
              <IconButton
                className={classes.snackbarIcon}
                aria-label="close snackbar"
              >
                <Close />
              </IconButton>
            }
            className={classes.successSnackbar}
          />
        </Snackbar>
        <Snackbar
          open={errorOpen}
          onClose={() => setErrorOpen(false)}
          autoHideDuration={4000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <SnackbarContent
            message={
              <Typography variant="body1">
                <ErrorOutline className={classes.snackbarIcon} />
                Error Saving Ingredients...
              </Typography>
            }
            action={
              <IconButton
                className={classes.snackbarIcon}
                aria-label="close snackbar"
              >
                <Close />
              </IconButton>
            }
            className={classes.errorSnackbar}
          />
        </Snackbar>
      </div>
    </Modal>
  );
}

const useStyles = makeStyles({
  errorSnackbar: {
    background: "red !important",
    color: "#f0f0f0 !important",
  },
  successSnackbar: {
    background: "green !important",
    color: "#f0f0f0 !important",
  },
  snackbarIcon: {
    verticalAlign: "text-bottom",
    marginBottom: "0 !important",
    color: "#f0f0f0",
  },
});

const getData = (
  props: Props,
  setIngredients: (ingredients: Ingredient[]) => void
) => {
  getUserById(props.uid)
    .then((user) => {
      if (user && user.ingredients.length !== 0) {
        setIngredients(user.ingredients);
      }
    })
    .catch((error) => console.log(error));
};

const saveData = (
  props: Props,
  ingredients: Ingredient[],
  setSuccessOpen: (b: boolean) => void,
  setErrorOpen: (b: boolean) => void
) => {
  // ingredients.forEach((ingredient) => {
  //   if (ingredient.qty === "") {
  //     ingredient.qty = 0;
  //   }
  // }); TODO test if this is necessary
  setUserIngredients({ ingredients: ingredients }, props.uid)
    .then((res) => {
      if (res) {
        setSuccessOpen(true);
      } else {
        setErrorOpen(true);
      }
    })
    .catch((error) => console.log(error));
};

const handleIngredientQtyChange = (
  event: FormEvent,
  ingredients: Ingredient[],
  setIngredients: (ingredients: Ingredient[]) => void
) => {
  const index = parseInt(
    (
      event.target as Element
    ).parentElement?.parentElement?.parentElement?.getAttribute("index") || "-1"
  );
  if (!isNaN(index) && index >= 0) {
    const newIngredients = [...ingredients];
    newIngredients[index-1].qty = +(event.target as HTMLInputElement).value;
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
    ).parentElement?.parentElement?.parentElement?.getAttribute("index") || "-1"
  );
  if (index) {
    const newIngredients = [...ingredients];
    newIngredients[index].units = (event.target as HTMLInputElement).value;
    setIngredients(newIngredients);
  }
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
  if (index) {
    const newIngredients = [...ingredients];
    newIngredients[index].name = (event.target as HTMLInputElement).value;
    setIngredients(newIngredients);
  }
};

const handleAddIngredient = (
  event: FormEvent,
  ingredients: Ingredient[],
  setIngredients: (i: Ingredient[]) => void
) => {
  event.preventDefault();
  setIngredients([...ingredients, { name: "", units: "cup", qty: 0 }]);
};

const afterClose = (setIngredients: (i: Ingredient[]) => void) => {
  setIngredients([{ name: "", units: "cup", qty: 0 }]);
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
