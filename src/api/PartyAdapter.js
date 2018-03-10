const baseUrl = 'http://localhost:3001'

class PartyAdapter {

  static createParty(data) {
    return fetch(`${baseUrl}/parties`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(res => res.json())
  }

  static getUserParty(id) {
    return fetch(`${baseUrl}/parties`, {
      method: 'GET',
      headers: headers()
    }).then(res => res.json())
  }

  static updateParty(id, data) {
    return fetch(`${baseUrl}/parties/${id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(res => res.json())
  }

  static deleteParty(id) {
    return fetch(`${baseUrl}/parties/${id}`, {
      method: 'DELETE',
      headers: headers()
    }).then(res => res.json())
  }
}

function headers () {
  return {
    'content-type': 'application/json',
    'accept': 'application/json',
    'Authorization': localStorage.getItem('jwt')
  }
}

export default PartyAdapter
