import React from "react";
import Square from "./Square"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectSquare } from '../actions'

let elevation;

class GridMap extends React.Component {
  state = {
    width: Math.sqrt(this.props.map.info.visited.length)
  }

  makeSquares = () => {
    let arr = []
    let key = 0
    let tiles = this.props.map.map.layout.match(/.{2}/g)
    for (let i=0; i < this.state.width; i++) {
      for (let j=0; j < this.state.width; j++) {
        arr.push(<Square
                    x={j}
                    y={i}
                    tile={tiles[key]}
                    visited={this.props.map.info.visited[key]}
                    key={key++} />)
      }
    }
    return arr
  }


  componentDidMount = () => {
    window.addEventListener("keydown", this.handleKeyPress)
  }

  componentWillUnmount = () => {
    window.removeEventListener("keydown", this.handleKeyPress)
  }

  //Should move in correct direction
  handleKeyPress = (e) => {
    switch(e.which) {
      //up
      case 87:
      case 38:
        this.movePiece(1, 0)
        break;
      //left
      case 65:
      case 37:
        this.movePiece(0, -1)
        break;
      //down
      case 83:
      case 40:
        this.movePiece(-1, 0)
        break;
      //right
      case 68:
      case 39:
        this.movePiece(0, 1)
    }
  }

  movePiece = (xChange, yChange) => {
    if (!this.props.encounter && !this.props.complete) {
      this.props.selectSquare(xChange, yChange, this.state.width)
    }
  }

  render() {
    return (
      <div className="map-container">
        <div className="grid-box"
             style={{"width": this.state.width * 150, "height": this.state.width * 150}}>
          { this.makeSquares() }
          <div id="sides"></div>
          <div id="sides2"></div>
        </div>
      </div>
    )
  }
 }

 const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({
     selectSquare: selectSquare
   }, dispatch)
 }

 const mapStateToProps = (state) => {
   return {
     encounter: state.gameLogic.encounter,
     complete: state.party.maps.find(pm => pm.map.id === state.gameLogic.currentMap).info.complete
   }
 }

export default connect(mapStateToProps, mapDispatchToProps)(GridMap)
