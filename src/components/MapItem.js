import React from "react";
import { connect } from 'react-redux'
import { enterBattle, importParty } from '../actions'
import PartyAdapter from "../api/PartyAdapter"


class MapItem extends React.Component {

  deleteMap = () => {
    PartyAdapter.updateParty(this.props.id, {map: {id: this.props.info.id, delete: true}, gold: this.props.gold})
      .then(this.props.importParty)
  }

  getStatus = () => {
    let moves = this.props.info.moves
    let width = Math.floor(Math.sqrt(this.props.info.visited.length))
    if (this.props.info.complete) {
      return "complete"
    } else if (moves === 0) {
      return "not-started"
    } else if (moves <= width) {
      return "in-progress"
    } else if (moves > width) {
      return "working-hard"
    }
  }

  enterBattle = (e) => {
    if (e.target.className !== "delete-button") {
      this.props.enterBattle(this.props.map.id, this.props.info.current_square)
    }
  }

  render() {

    return (
      <div>
        <div onClick={this.enterBattle}>
          <div className="map-name">
            {this.props.map.name}
            <button className="delete-button" onClick={this.deleteMap}>X</button>
          </div>
          <div className="map-stats">
            <div>Size: {Math.floor(Math.sqrt(this.props.info.visited.length))}</div>
            <div>Moves Taken: {this.props.info.moves}</div>
          </div>
          <div className={this.getStatus()}></div>
        </div>
      </div>
    )
  }
 }

const mapStateToProps = (state) => {
  return {
    id: state.party.party.id,
    gold: state.party.gold
  }
}

export default connect(mapStateToProps, { enterBattle, importParty })(MapItem)
