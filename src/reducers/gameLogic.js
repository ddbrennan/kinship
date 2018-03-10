export default (state = {
  selectedSquare: [0,0],
  previousSquare: [0,0],
  encounter: false,
  enemies: "",
  tabard: false,
  enemyArr: [],
  currentMap: null,
  questing: false
}, action) => {
  switch(action.type) {

    case 'SELECT_SQUARE':
      let previousSquare = state.selectedSquare
      let newX = state.selectedSquare[0] + action.change.x
      let newY = state.selectedSquare[1] + action.change.y
      const newSelection = [
        (newX >= 0 && newX < action.change.width) ? newX : state.selectedSquare[0],
        (newY >= 0 && newY < action.change.width) ? newY : state.selectedSquare[1]
      ]
      return {...state, selectedSquare: newSelection, previousSquare: previousSquare }

    case 'START_ENCOUNTER':
      return {...state, encounter: true, enemies: action.tile}

    case 'IMPORT_PARTY':
      let tabardStatus = state.tabard
      if (action.party.party) {
        tabardStatus = !!action.party.party.party_equipments.find(pe => pe.equipment_id === 4)
      }
      return {...state, tabard: tabardStatus}

    case 'RESET_MAP':
      return {...state, selectedSquare: [0,0], previousSquare: [0,0]}

    case 'SET_ENEMIES':
      return {...state, enemyArr: action.enemyArr }

    case 'ENTER_BATTLE':
      return {...state, currentMap: action.id, questing: true, selectedSquare: [parseInt(action.square[0]), parseInt(action.square[1])]}

    case 'RESOLVE_ENCOUNTER':
      let cs = action.party.party.party_maps.find(pm => pm.map_id === state.currentMap).current_square
      return {...state, questing: true, encounter: false, enemyArr: [], enemies: "", selectedSquare: [parseInt(cs[0]), parseInt(cs[1])]}

    case 'STOP_QUESTING':
      return {...state, questing: false }

    case 'DAMAGE_ENEMY':
      let enemies = state.enemyArr
      let enemy = enemies.find(e => e === action.enemy)
      enemy.health -= 1

      return {
        ...state,
        enemyArr: enemies
      }

    default:
      return state
  }
}
