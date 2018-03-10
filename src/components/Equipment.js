import React from "react";
import { purchaseItem, importParty } from '../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PartyAdapter from "../api/PartyAdapter"

class Equipment extends React.Component {

  checkOwnership = () => {
    return !!this.props.owned.find(e => {
      return e.equipment_id === this.props.equipment.id
    })
  }

  purchaseItem = () => {
    if (!this.checkOwnership() && this.props.gold >= this.props.equipment.cost ) {
      PartyAdapter.updateParty(this.props.partyId, {item: {equipment_id: this.props.equipment.id}, gold: this.props.gold - this.props.equipment.cost})
        .then(this.props.importParty)
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

  render() {
    return (
      <div className={`equip-for-sale ${this.checkOwnership() ? "owned" : ""}`}  onClick={this.purchaseItem}>
        <div className={`magazine ${this.slugify(this.props.equipment.name)}`}></div>
        <div className="equip-info">
          <h2>{this.props.equipment.name}</h2>
          <div className="cost-coin"></div><h3>{this.checkOwnership() ? "IN INVENTORY" : `${this.props.equipment.cost}`}</h3>
          <p>{this.props.equipment.bonus}</p>
        </div>
      </div>
    )
  }
 }

 const mapStateToProps = (state) => {
   return {
     gold: state.party.gold,
     owned: state.party.party.inventory,
     partyId: state.party.party.id
   }
 }

 const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({
     purchaseItem: purchaseItem,
     importParty: importParty
   }, dispatch)
 }

export default connect(mapStateToProps, mapDispatchToProps)(Equipment)
