import React, { useState, useEffect, FormEvent } from "react";
import {
  List,
  ListItem,
  TextField,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { getUserById } from "../../actions/actions";

import { Ingredient } from "../../types/dbtypes";

interface Props {
  uid: string;
  ingredients: Ingredient[];
  handleQtyChange: (e: FormEvent) => void;
  handleUnitsChange: (e: FormEvent) => void;
  handleNameChange: (e: FormEvent) => void;
  removeIngredient: (index: number) => void;
}

const massMeasures = ['kg', 'g', 'oz', 'lb']
const volMeasures = ['ml', 'l', 'tsp', 'Tbs', 'cup', 'pnt']
const defaultUnitOptions = [
  {label: 'unit', id: 0},
  ...massMeasures.map((unit, index) => ({label: unit, id: index + 1})),
  ...volMeasures.map((unit, index) => ({label: unit, id: index + massMeasures.length + 1})),
]
const getUnitGroup = (unit: string) => {
  if (unit === "unit") {
    return "Generic"
  } else if (massMeasures.includes(unit)) {
    return "Mass"
  } else if (volMeasures.includes(unit)) {
    return "Volume"
  } else {
    return "My Units"
  }
}

export default function IngredientList(props: Props) {
  const [options, setOptions] = useState(["Loading..."]);
  const [unitOptions, setUnitOptions] = useState<{label: string, id: number}[]>([])
  useEffect(() => {
    getUserById(props.uid).then((user) => {
      if (!user || user.ingredientHistory.length === 0) {
        setOptions(["None Found"]);
      } else {
        setOptions(user.ingredientHistory);
      }
      if (user && user.unitHistory && user.unitHistory.length > 0) {
        setUnitOptions([
          ...defaultUnitOptions,
          ...user.unitHistory.map((unit: string, index: number) => ({label: unit, id: index + defaultUnitOptions.length}))
        ])
      } else {
        setUnitOptions(defaultUnitOptions)
      }
    });
  }, [props.uid]);
  
  return (
    <List component="nav" aria-label="ingredient list">
      {props.ingredients.map((ingredient, index) => {
        return (
          <div key={index}>
            {/* @ts-ignore */}
            <ListItem className="ingredientContainer" index={index}>
              <TextField
                type="number"
                label="Quantity"
                className="qInput"
                id={`qinput-${index}`}
                // InputLabelProps={{ for: `qinput-${index}` }} TODO remove if we don't need
                inputProps={{ type: "number" }}
                onInput={props.handleQtyChange}
                value={ingredient.qty}
              />
              <Autocomplete
                style={{ minWidth: "175px", margin: "5px" }}
                className="uInput"
                id={`uinput-${index}`}
                options={unitOptions}
                value={ingredient.units}
                groupBy={(option) => getUnitGroup(option.label)}
                freeSolo
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Unit"
                    value={ingredient.units}
                    onSelect={props.handleUnitsChange}
                  />
                )}
              />
              <Autocomplete
                style={{ minWidth: "175px", margin: "5px" }}
                options={options}
                groupBy={() => "Suggestions:"}
                disableClearable
                freeSolo
                value={ingredient.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ingredient"
                    value={ingredient.name}
                    onSelect={props.handleNameChange}
                  />
                )}
              />
              <IconButton
                aria-label="remove entry"
                onClick={() => props.removeIngredient(index)}
              >
                <Clear />
              </IconButton>
            </ListItem>
            <hr />
          </div>
        );
      })}
    </List>
  );
}
