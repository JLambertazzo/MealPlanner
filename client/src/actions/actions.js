'use strict'
const log = console.log

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
    } else {
      log('error creating user')
    }
  }).then(json => {
    log('Success: ', json)
    return json
  }).catch(error => log(error))
}