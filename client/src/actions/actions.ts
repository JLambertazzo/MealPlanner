import { Ingredient, Meal } from "../types/dbtypes";

const log = console.log;
const api_url = process.env.API_URL || "http://localhost:8080";

export const checkLoggedIn = (setUid: (uid: string) => void) => {
  return fetch(`${api_url}/api/checkloggedin`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return { uid: null };
      }
    })
    .then((json) => {
      setUid(json.uid);
      return json.uid;
    })
    .catch((error) => log(error));
};

export const createUser = (payload: { username: string; password: string }) => {
  console.log("sending posted stuff to /api/users");
  const request = new Request(`${api_url}/api/users`, {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return fetch(request)
    .then(async (res) => {
      const asText = await res.text();
      console.log("WHATS", res.status, asText);
      if (res.ok) {
        return await res.json();
      } else if (res.status === 401) {
        alert(
          "User creation is disabled here... To try with custom accounts please run the app locally using the instructions on the github repo. To try the app here please use the example account. \n username: example \n password: password"
        );
      } else {
        log("error creating user");
      }
    })
    .then((json) => {
      return json;
    })
    .catch((error) => log(error));
};

export const login = (payload: { username: string; password: string }) => {
  const request = new Request(`${api_url}/api/login`, {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return fetch(request)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        log("error logging in");
      }
    })
    .then((json) => {
      return json;
    })
    .catch((error) => log(error));
};

export const getUserById = (uid: string) => {
  if (!uid) {
    return new Promise<undefined>((resolve, reject) => undefined);
  }
  return fetch(`${api_url}/api/users/${uid}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        log("error getting user");
      }
    })
    .then((json) => {
      return json;
    })
    .catch((error) => log(error));
};

export const addMeal = (payload: Meal, uid: string) => {
  const request = new Request(`${api_url}/api/users/${uid}/meals`, {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return fetch(request)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        log("error creating meal");
      }
    })
    .then((json) => {
      return json;
    })
    .catch((error) => log(error));
};

export const setUserIngredients = (
  payload: { ingredients: Ingredient[] },
  uid: string
) => {
  const request = new Request(`${api_url}/api/users/${uid}/ingredients`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
    },
  });

  return fetch(request)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        log("error saving ingredients");
      }
    })
    .then((json) => {
      return json;
    })
    .catch((error) => log(error));
};

export const deleteMeal = (uid: string, mid: string) => {
  const request = new Request(`${api_url}/api/users/${uid}/meals/${mid}`, {
    method: "delete",
  });

  return fetch(request)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        log("error deleting meal");
      }
    })
    .then((json) => {
      return json;
    })
    .catch((error) => log(error));
};

export const deleteMealHistory = (uid: string, mid: string) => {
  const request = new Request(
    `${api_url}/api/users/${uid}/mealHistory/${mid}`,
    {
      method: "delete",
    }
  );

  return fetch(request)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        log("error deleting meal");
      }
    })
    .then((json) => {
      return json;
    })
    .catch((error) => log(error));
};

export const deleteIngredientHistory = (uid: string, ingredient: string) => {
  const request = new Request(
    `${api_url}/api/users/${uid}/ingredientHistory/${ingredient}`,
    {
      method: "delete",
    }
  );

  return fetch(request)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        log("error deleting ingredient");
      }
    })
    .then((json) => {
      return json;
    })
    .catch((error) => log(error));
};

export const getIngredientNutriments = (ingredient: string) => {
  const request = new Request(
    `https://ca.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=${ingredient}&json=true`
  );

  return fetch(request)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        log("error getting ingredient info");
      }
    })
    .then((json) => {
      return json.products[0].nutriments;
    })
    .catch(log);
};

/*
 *
 * Unit Conversion & Operations
 * Planning:
 *  Data we are getting to start from is every ingredient has values per x grams and secondary measures like mL or whole pieces etc.
 *  First, we need to be able to grab nutrition values by gram, if we do everything through grams then it should be fine
 *  Issue is we sort of have to force *per gram* count. User can enter an mL value but if the ingredient isn't by mL then we
 *  show an icon and say "data not found, try using grams" or something. Also using this we now have 3 types of units to use, that is
 *  [grams, mL, whole], note whole should show nothing lol. SO here is the plan:
 *
 *  - Sample data will be stored with everything as per gram
 *  - We need a function to get data for a gram (helper)
 *  - We need a function to get data for specific grams
 *  - We need a function to check if we can get by mL (helper)
 *  - We need a function to get data and FIX THE DATA FOR DESIRED ML (hard)
 *  - We need a function to check if we can get by whole (helper)
 *  - We need a function to get data by and FIX THE DATA FOR WHOLE (hard)
 *
 */
