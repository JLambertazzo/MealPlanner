import React, { FormEvent, useState } from "react";
import Modal from "react-modal";
import { uid } from "react-uid";
import { getUserById } from "../../actions/actions";
import {
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
} from "@mui/material";
import { ChevronLeft, FileCopy, Print, Email } from "@mui/icons-material";
import convert, { Time, Unit } from "convert-units";
import "./ShoppingModal.css";
import { Ingredient, Meal } from "../../types/dbtypes";

interface Props {
  uid: string;
  isOpen: boolean;
  exit: () => void;
}

interface Need {
  [ingredient: string]: {
    [unit: string]: number;
  };
}

export default function ShoppingModal(props: Props) {
  //TODO TEST THIS PLEASE OMG
  const [need, setNeed] = useState<Need>({});
  const [time, setTime] = useState(7);
  Modal.setAppElement("#root");
  return (
    <Modal
      id="shoppingModal"
      isOpen={props.isOpen}
      onRequestClose={props.exit}
      onAfterOpen={() => getData(props, time, setNeed)}
      contentLabel="Shopping List Modal"
    >
      <div className="modalHeader">
        <Typography variant="h2">My Shopping List:</Typography>
        <Button
          onClick={props.exit}
          variant="contained"
          startIcon={<ChevronLeft />}
        >
          Return
        </Button>
      </div>
      <div className="shoppingControls">
        <Typography variant="h3" align="center">
          Ingredients Needed for  
        </Typography>
        <Select
          id="range-select"
          value={time}
          label="Range"
          onChange={(event) => setTime(event.target.value as number)}
        >
          <MenuItem value={7}>1 Week</MenuItem>
          <MenuItem value={14}>2 Weeks</MenuItem>
          <MenuItem value={31}>1 Month</MenuItem>
        </Select>
      </div>
      <div className="tablediv">
        {/* @ts-ignore SEE IF THIS WORKS TEST */}
        <TableContainer component="paper">
          <Table aria-label="Ingredient Table">
            <TableHead className="primaryBack">
              <TableRow>
                <TableCell>
                  <Typography variant="body1" color="secondary">
                    Ingredient
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" color="secondary">
                    Quantity
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(need).map((name) => {
                return (
                  <TableRow key={name} className="row">
                    <TableCell>
                      <Typography variant="body2" color="textPrimary">
                        {name}
                      </Typography>
                    </TableCell>
                    {Object.keys(need[name]).map((units) => {
                      return (
                        <TableCell component="th" scope="row" key={uid(units)}>
                          <Typography variant="body2">
                            {need[name][units]} {units}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Typography variant="h3" align="center">
        Export List:
      </Typography>
      <div id="exportContainer">
        <Button
          variant="contained"
          onClick={() => handleCopy(need)}
          startIcon={<FileCopy />}
        >
          Copy to Clipboard
        </Button>
        <Button
          variant="contained"
          onClick={() => window.print()}
          startIcon={<Print />}
        >
          Print
        </Button>
        <Button
          variant="contained"
          onClick={() => handleEmail(need)}
          startIcon={<Email />}
        >
          Share by Email
        </Button>
      </div>
    </Modal>
  );
}

const getData = (props: Props, time: number, setNeed: (need: Need) => void) => {
  getUserById(props.uid)
    .then((user) => {
      if (!user || user.meals.length === 0) {
        setNeed({ None: { kg: 0 } });
        return;
      }
      const need: Need = {};
      const now = new Date().getTime();
      let maxTime = new Date();
      if (time && time >= 0) {
        maxTime.setDate(maxTime.getDate() + (time + 1));
      } else {
        maxTime = new Date(8640000000000000);
      }
      user.meals.forEach((meal: Meal) => {
        const mealDate = new Date(meal.date);
        if (
          mealDate < maxTime &&
          (now < mealDate.getTime() ||
            new Date(now).toDateString() === mealDate.toDateString())
        ) {
          meal.ingredients.forEach((ingredient) => {
            let [qty, units] = convertUnits(ingredient.qty, ingredient.units);
            if (isNaN(Number(qty))) {
              console.log("conversion error");
              return;
            }
            qty = Number(qty);
            if (!need[ingredient.name]) {
              need[ingredient.name] = {};
            }
            if (!need[ingredient.name][units]) {
              need[ingredient.name][units] = qty;
            } else {
              need[ingredient.name][units] += qty;
            }
          });
        }
      });
      user.ingredients.forEach((ingredient: Ingredient) => {
        let [qty, units] = convertUnits(ingredient.qty, ingredient.units);
        if (isNaN(Number(qty))) {
          console.log("conversion error");
          return;
        }
        qty = Number(qty);
        if (need[ingredient.name] && need[ingredient.name][units]) {
          need[ingredient.name][units] -= qty;
        }
      });
      setNeed(need);
    })
    .catch((error) => {
      setNeed({ Error: { kg: -1 } });
      console.log(error);
    });
};

const convertUnits = (qty: number, ingUnits: string) => {
  let units: Unit = ingUnits as Unit;
  if (["ml", "l", "tsp", "Tbs", "cup", "pnt"].includes(units)) {
    return [Math.round(convert(qty).from(units).to("ml")), "ml"];
  } else if (["kg", "g", "oz", "lb"].includes(units)) {
    return [Math.round(convert(qty).from(units).to("kg")), "kg"];
  } else {
    console.log("Error converting");
    return [qty, units];
  }
};

const getText = (need: Need) => {
  const text = Object.keys(need).reduce((acc, name) => {
    let kgtext = null;
    let mltext = null;
    if (need[name].kg) {
      const qty = need[name].kg;
      kgtext = qty > 0 ? `${name}: ${qty} kg${qty > 1 ? "s" : ""}\n` : null;
    }
    if (need[name].ml) {
      const qty = need[name].ml;
      mltext = qty > 0 ? `${name}: ${qty} mL${qty > 1 ? "s" : ""}\n` : null;
    }
    const totalText = (kgtext || "") + (mltext || "");
    return acc + totalText;
  }, "");
  return text;
};

const handleCopy = (need: Need) => {
  window.navigator.clipboard.writeText(getText(need));
};

const handleEmail = (need: Need) => {
  window.open(`mailto:?subject=Groceries&body=${getText(need)}`, "_blank");
};

const handleTimeChange = (
  event: FormEvent,
  props: Props,
  time: number,
  setNeed: (need: Need) => void,
  setTime: (n: number) => void
) => {
  setTime(parseInt((event.target as HTMLInputElement).value));
  //@ts-ignore TEST THIS pls
  this.getData(props, time, setNeed);
};
