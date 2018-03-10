import React from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MapsAdapter from "../api/MapsAdapter"
import { createMap } from '../actions'
import MapItem from './MapItem'

class MapDisplay extends React.Component {

  state = {
    name: "",
    width: ""
  }

  //LIST OF MAPS
  listMaps = () => {

    if (this.props.maps) {
      return this.props.maps.map(m => <div className="map-item"><MapItem map={m.map} info={m.info} /></div>)
    }
  }

  createMap = (e) => {
    e.preventDefault()

    if (this.state.width && this.state.name) {

      const tiles = ["F", "M", "S", "W"]
      let width = this.state.width
      let mapLayout = "F0"
      let tile = ""

      let castle = Array(((width-1)*width)/2).fill("N")
      castle[Math.floor(Math.random() * castle.length)] = "C"

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < width; y++) {

          let type = tiles[Math.floor(Math.random() * 4)]
          let num = Math.floor(Math.random() * 2) + 1

          if (x+y < width && x+y > width/2) {
            num += 3
          } else if (x+y >= width) {
            num += 6
            if (castle.pop() === "C") {
              type = "C"
              num = 9
            }
          }
          if (x+y > 0) {
            mapLayout += (type + num)
          }
        }
      }

      let visited = "1"
      for (let i = 0; i < (mapLayout.length/2 - 1); i++) {
        visited += "0"
      }

      MapsAdapter.createMap({name: this.state.name, layout: mapLayout, visited: visited, party_id: this.props.id})
        .then(this.props.createMap)
      // this.props.createMap(this.state.name, mapLayout)

      this.setState({
        name: "",
        width: ""
      })
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  selectWidth = (val) => {
    this.setState({
      width: val
    })
  }

  render() {
    return (
      <div id="map-container">
        <div id="map-list">
          {this.listMaps()}
        </div>
        <div id="map-generator">
          <h3 id="map-create-title">Create A New Map</h3>
            <div id="map-create-name">
              <input type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Map Name"></input>
            </div>
          <div id="width-select">
              <div onClick={() => this.selectWidth("4")} className={this.state.width === "4" ? "chosen width" : "width"}>4 x 4</div>
              <div onClick={() => this.selectWidth("5")} className={this.state.width === "5" ? "chosen width" : "width"}>5 x 5</div>
              <div onClick={() => this.selectWidth("6")} className={this.state.width === "6" ? "chosen width" : "width"}>6 x 6</div>
              <div onClick={() => this.selectWidth("7")} className={this.state.width === "7" ? "chosen width" : "width"}>7 x 7</div>
            </div>

            <div id="map-create-submit">
            <button onClick={this.createMap}>Create Map</button>
            </div>
        </div>
      </div>
    )
  }
 }

const mapStateToProps = (state) => {
  return {
    maps: state.party.maps,
    id: state.party.party.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    createMap: createMap
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapDisplay)
