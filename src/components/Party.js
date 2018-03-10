import React from "react"
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PartyAdapter from "../api/PartyAdapter"
import { importParty, deleteParty, updateParty, logOut } from '../actions'
import Character from './Character'
import MapDisplay from './MapDisplay'
import CreateCharacter from './CreateCharacter'
import { withRouter } from "react-router-dom"




class Party extends React.Component {
  state = {
    editing: false,
    name: this.props.party.name,
    heldEquipment: ""
  }

  componentDidMount = () => {
    if (localStorage.getItem('jwt')) {
      PartyAdapter.getUserParty()
        .then(party => {
          if (party) {
            this.props.importParty(party)
          }
        })
      }
  }

  mapMembers = () => {
    if (this.props.party.members) {
      return this.props.party.members.map(m => {
        return (<div className="party-display-char">
                  <div className="avatar-container">
                    <div className={`party-display-char-avatar ${m.role}-avatar`}>
                      <Character key={m.id} character={m} />
                    </div>
                  </div>
                  <div className="avatar-name">
                    <h3> {m.name} </h3>
                  </div>
                  <div className="personal-inventory" onClick={this.equipItem} id={`${m.id}member`}>{this.findEquipment(m.id)}</div>
                </div>)
              })
    }
  }

  findEquipment = (owner) => {
    let result = "No Items Equipped"
    let item = this.props.party.equipment.find(e => e.owner_id === owner)
    if (item) {
      let equip = this.props.party.equipmentAll.find(e => e.id === item.equipment_id)
      result = equip.name
    }
    return result
  }

  equipItem = (e) => {
    let oldEquip = this.props.party.equipment.find(item => item.owner_id === parseInt(e.target.id))
    let held = ""
    if (oldEquip) {
      oldEquip.owner_id = null
      held = oldEquip.id
    }


    let newEquip = this.props.party.equipment.find(item => item.id === parseInt(this.state.heldEquipment))

    if (newEquip) {
      newEquip.owner_id = parseInt(e.target.id)
      newEquip.update = true
    }

    this.setState({
      heldEquipment: held
    })

    //send info to DB
    PartyAdapter.updateParty(this.props.party.id, {item: newEquip, gold: this.props.party.gold})
  }

  pickUpItem = (e) => {
    this.setState({
      heldEquipment: e.target.id
    })
  }

  mapEquipment = () => {
    if (this.props.party.equipment) {
      return this.props.party.equipment.map(e => {
        let equip = this.props.party.equipmentAll.find(item => item.id === e.equipment_id)
        let user = this.props.party.members.find(member => member.id === e.owner_id)
        if (!user && parseInt(this.state.heldEquipment) !== e.id)  {
          return <div onClick={this.pickUpItem} id={`${e.id}equip`} className={`party-equipment-display ${this.slugify(equip.name)}`}></div>
        }
      })
    }
  }

  slugify = (string) => {
    return string.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  }

  movingEquipment = () => {
    if (this.state.heldEquipment) {
      let item = this.props.party.equipment.find(e => e.id === parseInt(this.state.heldEquipment))
      let equip = this.props.party.equipmentAll.find(e => e.id === item.equipment_id)
      return <div className={`${this.slugify(equip.name)} moving`}></div>
    }
  }

  setDownEquipment = (e) => {
    if (this.state.heldEquipment && e.target.id === "inventory") {

      let newEquip = {...this.props.party.equipment.find(item => item.id === parseInt(this.state.heldEquipment))}
      newEquip.id = 0
      newEquip.update = true

      this.setState({
        heldEquipment: ""
      })

      PartyAdapter.updateParty(this.props.party.id, {item: newEquip, gold: this.props.party.gold})
    }
  }

  deleteParty = () => {
    PartyAdapter.deleteParty(this.props.party.id)
      .then(this.props.deleteParty)
  }

  startEditing = () => {
    if (!this.state.editing) {
      this.setState({
        editing: true
      })
    } else {
      this.setState({
        editing: false
      })
      PartyAdapter.updateParty(this.props.party.id, {party: {name: this.state.name}})
        .then(this.props.importParty)
    }
  }

  handleChange = (e) => {
    this.setState({
      name: e.target.innerHTML
    })
  }

  renderButton = () => {
    return <button className="store-link" onClick={() => { this.props.history.push('/store') }}>Store</button>
  }

  logout = () => {
    localStorage.removeItem('jwt')
    this.props.logOut()
    this.props.history.push('/home')
  }

  render() {
    return (
            <div>
              { this.props.party.id ?
                <div>
                  {!this.props.questing ?
                    <div id="party-container">
                      {this.renderButton()}

                      <div className="party-name">
                        <h1 contentEditable={this.state.editing} onBlur={this.handleChange}>{this.props.party.name && this.props.party.name.toUpperCase()}</h1>
                      </div>

                      <button id="edit-button" onClick={this.startEditing}>
                        {this.state.editing ? "Save Name" : "Edit Name"}
                      </button>

                      <button id="logout-button" onClick={this.logout}>Logout</button>

                      <MapDisplay />

                      <div id="party-members">{this.mapMembers()}</div>
                      <div id="inventory" onClick={this.setDownEquipment}>
                        {this.mapEquipment()}
                        {this.movingEquipment()}
                      </div>
                      <div id="gold-display">
                        <div id="gold-coin"></div>
                        <p>{this.props.party.gold}</p>
                      </div>
                      <button id="delete-party" onClick={this.deleteParty}>X</button>
                    </div>
                    :
                    <Redirect to="/battlefield"></Redirect>
                  }
                </div>
                :
                <CreateCharacter />
                }
            </div>
              )
  }
 }


 const mapStateToProps = (state) => {

   return {
     auth: {
       isLoggedIn: state.auth.isLoggedIn,
       user: state.auth.user
     },
     party: {
       name: state.party.party.name,
       members: state.party.party.members,
       equipment: state.party.party.inventory,
       equipmentAll: state.party.equipment,
       id: state.party.party.id,
       gold: state.party.gold
     },
     questing: state.gameLogic.questing

   }
 }

 const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({
     importParty: importParty,
     deleteParty: deleteParty,
     logOut: logOut
   }, dispatch)
 }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Party))
