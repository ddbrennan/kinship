import React from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startEncounter } from '../actions'
import Character from './Character'


class Square extends React.Component {

  componentDidUpdate = (prevProps, prevState) => {
    if (!!this.isSelected() && !parseInt(this.props.visited)) {
      this.props.startEncounter(this.props.tile)
    }
  }

  determineClass = () => {

    switch(this.props.tile[0]) {
      case 'M':
        return "mountain"
      case 'F':
        return "field"
      case 'W':
        return "woods"
      case 'S':
        return "swamp"
      case 'C':
        return "castle"
    }
  }

  beenVisited = () => {

    return !!parseInt(this.props.visitedArray[this.props.x + this.props.y*Math.sqrt(this.props.visitedArray.length)]) ? 'visited' : ''
  }

  isSelected = () => {
    return this.props.x === this.props.selectedSquare[0] && this.props.y === this.props.selectedSquare[1] ? 'selected' : ''
  }



  render() {

    return (
      <div>
        <div
          className={`square ${this.determineClass()} ${this.isSelected()} ${this.beenVisited()}`}>
        </div>
      </div>
    )
  }
 }

 const mapStateToProps = (state) => {
    return {
      selectedSquare: state.gameLogic.selectedSquare,
      character: state.party.party.members[0],
      visitedArray: state.party.maps.find(pm => pm.map.id === state.gameLogic.currentMap).info.visited
    }
 }

 const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({
     startEncounter: startEncounter
   }, dispatch)
 }

export default connect(mapStateToProps, mapDispatchToProps)(Square)
