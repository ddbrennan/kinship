import React from "react";
import Character from "./Character"
import PartyAdapter from "../api/PartyAdapter"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { importParty } from '../actions'

class CreateCharacter extends React.Component {
  state = {
    name: "",
    role: "Knight",
    color: "pale",
    armor_color: "red"
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  setStat = (stat, value) => {
    this.setState({
      [stat]: value
    })
  }

  submitForm = (e) => {
    e.preventDefault()
    if (this.state.name) {
      PartyAdapter.createParty({member: this.state, name: `${this.props.user.username}'s Party`, user_id: this.props.user.id})
        .then(this.props.importParty)
    }
  }

  render() {
    return (
      <div id="create-container">
        <div className="party-name">
          <h1>CREATE YOUR CHARACTER</h1>
        </div>
        <div className="nca-container">
          <div className="new-char-avatar">
            <Character character={{
                name: this.state.name,
                role: this.state.role,
                color: this.state.color,
                armor_color: this.state.armor_color
              }}></Character>
          </div>
        </div>

        <div id="new-char-form">
          <input type="text" name="name" value={this.state.name} onChange={this.onChange} placeholder="Character Name"></input>


          <div id="class-select">
            <h3>Class</h3>
            <div className="create-options">
            <div onClick={() => this.setStat("role", "Knight")} className={this.state.role === "Knight" ? "chosen-r role" : "role"}>Knight</div>
            <div onClick={() => this.setStat("role", "Cleric")} className={this.state.role === "Cleric" ? "chosen-r role" : "role"}>Cleric</div>
            <div onClick={() => this.setStat("role", "Rogue")} className={this.state.role === "Rogue" ? "chosen-r role" : "role"}>Rogue</div>
            <div onClick={() => this.setStat("role", "Mage")} className={this.state.role === "Mage" ? "chosen-r role" : "role"}>Mage</div>
          </div>
          </div>


          <div id="armor-color-select">
            <h3>Armor Color</h3>
            <div className="create-options">
              <div onClick={() => this.setStat("armor_color", "red")} className={this.state.armor_color === "red" ? "chosen-r armor_color" : "armor_color"}>Red</div>
              <div onClick={() => this.setStat("armor_color", "blue")} className={this.state.armor_color === "blue" ? "chosen-r armor_color" : "armor_color"}>Blue</div>
              <div onClick={() => this.setStat("armor_color", "green")} className={this.state.armor_color === "green" ? "chosen-r armor_color" : "armor_color"}>Green</div>
              <div onClick={() => this.setStat("armor_color", "yellow")} className={this.state.armor_color === "yellow" ? "chosen-r armor_color" : "armor_color"}>Yellow</div>
            </div>
          </div>


          <div id="accent-color-select">
            <h3>Accent Color</h3>
            <div className="create-options">
            <div onClick={() => this.setStat("color", "pale")} className={this.state.color === "pale" ? "chosen-r color" : "color"}>1</div>
            <div onClick={() => this.setStat("color", "tan")} className={this.state.color === "tan" ? "chosen-r color" : "color"}>2</div>
            <div onClick={() => this.setStat("color", "brown")} className={this.state.color === "brown" ? "chosen-r color" : "color"}>3</div>
            <div onClick={() => this.setStat("color", "dark")} className={this.state.color === "dark" ? "chosen-r color" : "color"}>4</div>
          </div>
          </div>

          <button id="create-char" onClick={this.submitForm}>Create Character</button>
        </div>
      </div>
    )
  }
 }

 const mapStateToProps = (state) => {
    return {
      user: state.auth.user
    }
 }

 const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({
     importParty: importParty
   }, dispatch)
 }

export default connect(mapStateToProps, mapDispatchToProps)(CreateCharacter)
