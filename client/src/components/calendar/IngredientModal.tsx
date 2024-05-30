import React, { FormEvent, useState, useEffect } from "react";
import Modal from "react-modal";
import { getUserById, setUserIngredients } from "../../actions/actions";
import {
  Button,
  Typography,
  Snackbar,
  SnackbarContent,
  IconButton,
} from "@mui/material";
import {
  Save,
  Add,
  ChevronLeft,
  ErrorOutline,
  Close,
  CheckCircleOutline,
} from "@mui/icons-material";
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

  useEffect(() => {
    if (props.isOpen && props.uid) {
      console.log("getting");
      getUserById(props.uid)
        .then((user) => {
          if (user && user.ingredients.length !== 0) {
            console.log("SETTING", user.ingredients);
            setIngredients(user.ingredients);
          }
        })
        .catch((error) => console.log(error));
    } else {
      console.log("no");
    }
  }, [props.isOpen, props.uid, setIngredients]);

  const saveData = () => {
    console.log(ingredients);
    const filteredIngredients = ingredients.filter((ing) => ing.name !== "");
    if (filteredIngredients.length === 0) {
      return;
    }
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

  const handleIngredientQtyChange = (event: FormEvent) => {
    const index = parseInt(
      (
        event.target as Element
      ).parentElement?.parentElement?.parentElement?.getAttribute("index") ||
        "-1"
    );
    if (!isNaN(index) && index >= 0) {
      const newIngredients = [...ingredients];
      newIngredients[index].qty = +(event.target as HTMLInputElement).value;
      setIngredients(newIngredients);
    }
  };

  const handleIngredientUnitsChange = (event: FormEvent) => {
    const index = parseInt(
      (
        event.target as HTMLInputElement
      ).parentElement?.parentElement?.parentElement?.parentElement?.getAttribute(
        "index"
      ) || "-1"
    );
    if (!isNaN(index) && index >= 0) {
      const newIngredients = [...ingredients];
      newIngredients[index].units = (event.target as HTMLInputElement).value;
      setIngredients(newIngredients);
    }
  };

  const handleIngredientNameChange = (event: FormEvent) => {
    const index = parseInt(
      (
        event.target as HTMLInputElement
      ).parentElement?.parentElement?.parentElement?.parentElement?.getAttribute(
        "index"
      ) || "-1"
    );
    if (!isNaN(index) && index >= 0) {
      const newIngredients = [...ingredients];
      newIngredients[index].name = (event.target as HTMLInputElement).value;
      console.log(newIngredients[index].name);
      console.log(newIngredients);
      setIngredients(newIngredients);
    }
  };

  const handleAddIngredient = (event: FormEvent) => {
    event.preventDefault();
    setIngredients([...ingredients, { name: "", units: "cup", qty: 0 }]);
  };

  const afterClose = () => {
    setIngredients([{ name: "", units: "cup", qty: 0 }]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  return (
    <Modal
      id="ingredientModal"
      isOpen={props.isOpen}
      onRequestClose={props.exit}
      onAfterClose={afterClose}
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
          handleQtyChange={(event) => handleIngredientQtyChange(event)}
          handleUnitsChange={(event) => handleIngredientUnitsChange(event)}
          handleNameChange={(event) => handleIngredientNameChange(event)}
          removeIngredient={(index) => removeIngredient(index)}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={(event) => handleAddIngredient(event)}
        >
          Add Ingredient
        </Button>
        <Button
          id="saveButton"
          variant="contained"
          startIcon={<Save />}
          onClick={saveData}
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
                <CheckCircleOutline className="snackbarIcon" />
                Successfully Saved Ingredients!
              </Typography>
            }
            action={
              <IconButton
                className="snackbarIcon"
                aria-label="close snackbar"
                onClick={() => setSuccessOpen(false)}
              >
                <Close />
              </IconButton>
            }
            className="successSnackbar"
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
                <ErrorOutline className="snackbarIcon" />
                Error Saving Ingredients...
              </Typography>
            }
            action={
              <IconButton className="snackbarIcon" aria-label="close snackbar">
                <Close />
              </IconButton>
            }
            className="errorSnackbar"
          />
        </Snackbar>
      </div>
    </Modal>
  );
}
