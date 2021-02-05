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

export const deleteMeal = (payload, uid, mid) => {
  const request = new Request(`/api/users/${uid}/meals/${mid}`, {
    method: 'delete',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
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

export const deleteIngredient = (payload, uid, iid) => {
  const request = new Request(`/api/users/${uid}/ingredients/${iid}`, {
    method: 'delete',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
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
