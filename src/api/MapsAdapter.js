const baseUrl = 'http://localhost:3001'

class MapsAdapter {

  static createMap(data) {
    return fetch(`${baseUrl}/maps`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
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

export default MapsAdapter
