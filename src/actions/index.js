export function logIn(user) {
  return { type: 'LOG_IN', user: user }
}

export function logOut() {
  return { type: 'LOG_OUT' }
}

export function importParty(party) {
  return { type: 'IMPORT_PARTY', party: party }
}

export function resetMap(party) {
  return { type: 'RESET_MAP', party: party }
}

export function selectSquare(x,y,width) {
  return { type: 'SELECT_SQUARE', change: {x: x, y: y, width: width} }
}

export function startEncounter(tile) {
  return { type: 'START_ENCOUNTER', tile: tile }
}

export function setEnemies(enemyArr) {
  return { type: 'SET_ENEMIES', enemyArr: enemyArr }
}

export function purchaseItem(gold, pes) {
  return { type: 'PURCHASE_ITEM', gold: gold, pes: pes}
}

export function resolveEncounter(party) {
  return {type: 'RESOLVE_ENCOUNTER', party: party }
}

export function deleteParty() {
  return { type: 'DELETE_PARTY' }
}

export function createMap(data) {
  return { type: 'CREATE_MAP', data: data }
}

export function enterBattle(id, square) {
  return { type: 'ENTER_BATTLE', id: id, square: square }
}

export function stopQuesting() {
  return { type: 'STOP_QUESTING' }
}

export function damageEnemy(enemy) {
  return { type: 'DAMAGE_ENEMY', enemy: enemy}
}
