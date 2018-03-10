import React from "react";
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Equipment from './Equipment'
import { withRouter } from "react-router-dom"


class Store extends React.Component {

  displayEquipment = () => {
    return this.props.equipment.all.map(e => <Equipment
                                                key={e.id}
                                                equipment={e} />)
  }

  renderButton = () => {
    return <button className="party-link" onClick={() => { this.props.history.push('/party') }}>Party</button>
  }

  render() {
    return (
          <div id="store-container">
            <div className="store-name">
              <h1>THE STORE</h1>
            </div>
            <div id="gold-display">
                <div id="gold-coin"></div>
                <p>{this.props.gold}</p>
            </div>
            {this.renderButton()}
            <div id="store-equipment">
              { this.displayEquipment() }
            </div>
          </div>
    )
  }
 }

 const mapStateToProps = (state) => {
   return {
     equipment: {
       owned: state.party.party.equipment,
       all: state.party.equipment
     },
     gold: state.party.gold
   }
 }

export default withRouter(connect(mapStateToProps)(Store))
