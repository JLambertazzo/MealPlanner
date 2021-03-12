const log = console.log

export const checkLoggedIn = (app) => {
  return fetch('/api/checkloggedin').then(res => {
    if (res.ok) {
      return res.json()
    } else {
      return { uid: null }
    }
  }).then(json => {
    app.setState({ uid: json.uid })
    return json.uid
  }).catch(error => log(error))
}

export const checkLoggedInTest = (setUid) => {
  return fetch('/api/checkloggedin').then(res => {
    if (res.ok) {
      return res.json()
    } else {
      return { uid: null }
    }
  }).then(json => {
    setUid(json.uid)
    return json.uid
  }).catch(error => log(error))
}

export const createUser = (payload) => {
  const request = new Request('/api/users', {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else if (res.status === 401) {
      alert('User creation is disabled here... To try with custom accounts please run the app locally using the instructions on the github repo. To try the app here please use the example account. \n username: example \n password: password')
    } else {
      log('error creating user')
    }
  }).then(json => {
    return json
  }).catch(error => log(error))
}

export const login = (payload) => {
  const request = new Request('/api/login', {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error logging in')
    }
  }).then(json => {
    return json
  }).catch(error => log(error))
}

export const getUserById = (uid) => {
  return fetch(`/api/users/${uid}`).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error getting user')
    }
  }).then(json => {
    return json
  }).catch(error => log(error))
}

export const addMeal = (payload, uid) => {
  const request = new Request(`/api/users/${uid}/meals`, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error creating meal')
    }
  }).then(json => {
    return json
  }).catch(error => log(error))
}

export const setUserIngredients = (payload, uid) => {
  const request = new Request(`/api/users/${uid}/ingredients`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*'
    }
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error saving ingredients')
    }
  }).then(json => {
    return json
  }).catch(error => log(error))
}

export const deleteMeal = (uid, mid) => {
  const request = new Request(`/api/users/${uid}/meals/${mid}`, {
    method: 'delete'
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error deleting meal')
    }
  }).then(json => {
    return json
  }).catch(error => log(error))
}

export const deleteMealHistory = (uid, mid) => {
  const request = new Request(`/api/users/${uid}/mealHistory/${mid}`, {
    method: 'delete'
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error deleting meal')
    }
  }).then(json => {
    return json
  }).catch(error => log(error))
}

export const deleteIngredientHistory = (uid, ingredient) => {
  const request = new Request(`/api/users/${uid}/ingredientHistory/${ingredient}`, {
    method: 'delete'
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error deleting ingredient')
    }
  }).then(json => {
    return json
  }).catch(error => log(error))
}

export const getIngredientNutriments = (ingredient) => {
  const request = new Request(`https://ca.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=${ingredient}&json=true`)

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error getting ingredient info')
    }
  }).then(json => {
    return json.products[0].nutriments
  }).catch(log)
}
