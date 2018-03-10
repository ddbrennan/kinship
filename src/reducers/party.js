export default (state = {
  party: {},
  equipment: [],
  characters: [],
  gold: 0,
  maps: []
}, action) => {
  switch(action.type) {
    case 'IMPORT_PARTY':
    case 'RESET_MAP':
      if (action.party.party) {
        const party = {
          name: action.party.party.name,
          id: action.party.party.id,
          members: action.party.party.party_characters,
          inventory: action.party.party.party_equipments
        }

        return {
          ...state,
          characters: action.party.characters,
          equipment: action.party.equipment,
          party: party,
          maps: action.party.maps,
          gold: action.party.party.gold
        }
      } else {
        return state
      }

    case 'LOG_OUT':
    case 'DELETE_PARTY':
      return {
        party: {},
        equipment: [],
        characters: [],
        gold: 0,
        maps: []
      }

    case 'PURCHASE_ITEM':
      return {
        ...state,
        gold: action.gold,
        party: {
          ...state.party,
          inventory: action.pes
        }
      }

    case 'EARN_GOLD':
      return {
        ...state,
        gold: state.gold + action.amount
      }

    case 'RESOLVE_ENCOUNTER':
      return {
        ...state,
        party: {
          ...state.party,
          members: action.party.party.party_characters
        },
        gold: action.party.party.gold,
        maps: action.party.maps
      }

    case 'CREATE_MAP':
      return {
        ...state,
        maps: action.data.maps
      }

    default:
      return state
  }
}
