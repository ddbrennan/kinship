import React from "react";
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GridMap from './GridMap'
import Encounter from './Encounter'
import Character from './Character'
import { stopQuesting, resetMap } from '../actions'
import PartyAdapter from "../api/PartyAdapter"
import { withRouter } from "react-router-dom"



class Battlefield extends React.Component {

  componentWillUnmount = () => {
    this.props.stopQuesting()
  }

  resetMap = () => {
    let visited = "1"
    for (let i = 1; i < this.props.map.info.visited.length; i++) {
      visited += "0"
    }
    this.props.map.info.visited = visited
    this.props.map.info.complete = false
    this.props.map.info.current_square = "00"

    PartyAdapter.updateParty(this.props.id, {map: this.props.map.info, gold: this.props.gold})
      .then(this.props.resetMap)
  }

  renderButton = () => {
    return <button className="bf-party-link" onClick={() => { this.props.history.push('/party') }}>Party</button>
  }

  render() {
    return (
      <div id="battlefield">
        { this.props.questing ?
          <div>
            {this.renderButton()}
            <div className="move-counter">
              <p>Moves Taken:</p>
              <h2>{this.props.map.info.moves}</h2>
            </div>
          { this.props.encounter && <Encounter />}
          <GridMap map={this.props.map} />
          {this.props.map.info.complete ?
            <div id="map-complete">
              <div>Congratulations! You Captured the Castle</div>
              <button onClick={this.resetMap}>Reset the Map?</button>
            </div>
            :
            null
          }
          </div>
        :
          <Redirect to="/party" />
        }
      </div>
    )
  }
 }


 const mapStateToProps = (state) => {
   console.log("encounter: ", state.gameLogic.encounter)
   let character = {}
   if (state.party.party.members) {
     character = {
       ...state.party.party.members[0],
       armorColor: state.party.party.members[0].armor_color,
       role: state.party.characters.find(c => c.id === state.party.party.members[0].character_id).role
     }
   }

   let map ={}

   if (state.party.maps.length) {
     map = state.party.maps.find(m => m.map.id === state.gameLogic.currentMap)
   }

   return {
     auth: {
       isLoggedIn: state.auth.isLoggedIn,
       user: state.auth.user
     },
     map: map,
     encounter: state.gameLogic.encounter,
     character: character,
     questing: state.gameLogic.questing,
     id: state.party.party.id,
     gold: state.party.gold
   }
 }

export default withRouter(connect(mapStateToProps, { stopQuesting, resetMap })(Battlefield))
