import React from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { } from '../actions'
import BattleCharacter from './BattleCharacter'
import { resolveEncounter, damageEnemy } from '../actions'
import PartyAdapter from '../api/PartyAdapter'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom"


class Battle extends React.Component {
  state = {
    rolls: [],
    locked: {0: false, 1: false, 2: false, 3: false, 4: false, 5: false},
    combatants: [],
    rolling: false,
    spellcasting: false,
    currentTurn: 0,
    rollCount: 0,
    damage: 0,
    healer: ""
  }

  getAllList = () => {
    if (this.props.enemies && this.props.allies) {
      const enemies = this.props.enemies
      const allies = this.props.allies
      let cap = Math.max(enemies.length, allies.length)
      let allList = []

      //compare, loop over longer of the two

      for (let i = 0; i < cap; i++) {
        if (allies[i]) {
          allList.push(allies[i])
        }
        if (enemies[i]) {
          allList.push(enemies[i])
        }
      }

      return allList
    }

  }


  componentDidMount = () => {
    this.setState({
      combatants: this.getAllList()
    })
  }

  pcAlive = () => {
    return !!this.state.combatants.find(char => {
      return (char.health > 0 && char.party_id !== 0)
    })
  }

  npcAlive = () => {
    return !!this.state.combatants.find(char => {
      return (char.health > 0 && char.party_id === 0)
    })
  }

  //TAKE TURNS
  takeTurns = () => {
    if (this.pcAlive() && this.npcAlive()) {
      this.takeTurn(this.state.combatants[this.state.currentTurn])
    } else {
      this.resolveBattle()
    }
  }

  //TURN
  takeTurn = (combatant) => {
    if (combatant.party_id !== 0) {
      this.startUserTurn(combatant)
    } else {
      this.takeNPCTurn(combatant)
    }
  }

  startUserTurn = (char) => {
    // check if alive
    if (char.health > 0) {
      // highlight character
      this.dicePhase()
    } else {
      this.passTurn()
    }
  }

  dicePhase = () => {
    this.setState({
      rolling: true,
      rollCount: 0
    })
  }

  addEquipment = (weapon) => {
      let newRolls = [...this.state.rolls, ...Array(weapon.amount).fill(weapon.category)]

      this.setState({
        rolls: newRolls
      }, this.evalRolls)
  }

  evaluateDice = () => {
    let activeChar = this.state.combatants[this.state.currentTurn]
    let weapon = this.props.party.inventory.find(i => i.owner_id === activeChar.id)

    if (weapon) {
      let stats = this.props.party.allEquipment.find(e => e.id === weapon.equipment_id)
      this.addEquipment(stats)
    } else {
      this.evalRolls()
    }
  }

  evalRolls = () => {
    console.log(this.state.rolls)
    let activeChar = this.state.combatants[this.state.currentTurn]
    let evalRolls = {heart: 0, sword: 0, mana: 0}
    for (let face of this.state.rolls) {
      evalRolls[face] += 1
    }
    //add damage to pool
    // heal active character
    if (activeChar.health + evalRolls.heart < activeChar.max_health) {
      activeChar.health += evalRolls.heart
    } else {
      activeChar.health = activeChar.max_health
    }
    // add mana to mana pool (persists for fight)
    activeChar.mana += evalRolls.mana

    this.setState({
      damage: evalRolls.sword
    })

    if (evalRolls.sword === 0) {
      this.startSpellcasting()
    }
  }

  startSpellcasting = () => {
    this.setState({
      spellcasting: true
    })
  }



  takeNPCTurn = (char) => {
    if (char.health > 0) {
      setTimeout(() => this.npcAttack(char), 1000)
    } else {
      this.passTurn()
    }

  }

  npcAttack = (char) => {
    let swords = 6
    let hearts = 0
    if ((char.health/char.max_health) < .5) {
      hearts = Math.floor(Math.random() * 4)
      swords -= hearts
    }

    this.state.combatants[this.state.currentTurn].health += hearts

    let targets = this.props.allies.sort((a, b) => a.health - b.health)

    for (let i = 0; i < swords; i++) {
      let target = this.getTarget(targets)
      if (target) {
        this.state.combatants.find(c => c === target).health -= 1
      }
    }
    if (!this.pcAlive()) {
      this.resolveBattle()
    }
    this.passTurn()
  }

  getTarget(targets) {
    let target = targets.find(t => t.role === "Knight" && t.health > 0)
    if (!target) {
      target = targets.find(t => t.health > 0)
    }
    return target
  }

  endSpellcasting = () => {
    this.setState({
      spellcasting: false,
      healer: ""
    })

    this.passTurn()
  }

  passTurn = () => {

    let currentTurn = this.state.currentTurn + 1

    if (currentTurn >= this.state.combatants.length) {
      currentTurn = 0
    }

    this.setState({
      currentTurn: currentTurn,
      rolls: [],
      locked: {0: false, 1: false, 2: false, 3: false, 4: false, 5: false}
    }, this.takeTurns)
  }

  rollDice = (rolls = 6) => {
    let arr = []
    const faces = ["sword", "heart", "mana"]

    for (let i=0; i < rolls; i++) {
      if (this.state.locked[i]) {
        arr.push(this.state.rolls[i])
      } else {
        arr.push(faces[Math.floor(Math.random() * 3)])
      }
    }

    return arr
  }

  setDiceRoll = () => {
    let rolls = this.rollDice(6)
    let newRC = this.state.rollCount + 1
    let doneRolling = false
    if (newRC > 2) {
      this.setState({
        rolls: rolls,
        rollCount: newRC,
      }, this.evaluateDice)
    } else {
      this.setState({
        rolls: rolls,
        rollCount: newRC
      })
    }
  }

  displayDiceRoll = () => {
    return this.state.rolls.map((r,i) => <label className="dice-lock"><div className={this.state.locked[i] ? "locked" : "unlocked"}></div><div className={`roll ${r}-dice`}></div><input className="die-check" type="checkbox" name={i} onChange={this.lockDie}/></label>)
  }

  lockDie = (e) => {
    let status = !this.state.locked[e.target.name]
    this.setState({
      locked: {
        ...this.state.locked,
        [e.target.name]: status
      }
    })
  }


  //ALL CHARACTER ON ONE SIDE DEAD
  resolveBattle = () => {
    let reward = this.state.combatants.filter(c => (!c.party_id && c.health < 1)).length * 100
    let recruit
    let currentSquare = this.props.previousSquare.join("")
    let visited = this.props.map.info.visited
    let moveCount = this.props.map.info.moves + 1
    let complete = false

    let result
    if (this.pcAlive()) {
      result = "won"
    } else {
      result = "lost"
    }
    this.setState({ result })

    if (this.state.combatants.find(c => (!!c.party_id && c.health > 0))) {
      recruit = this.props.enemies.shift()
      recruit.health = recruit.max_health
      currentSquare = this.props.selectedSquare.join("")
      let visId = [this.props.selectedSquare[0] + this.props.selectedSquare[1]*Math.sqrt(this.props.map.info.visited.length)]
      let newVis = visited.split("")
      newVis[visId] = 1
      visited = newVis.join("")
      if (this.props.map.map.layout.match(/.{2}/g)[visId][0] === "C") {
        complete = true
      }
    }

    let partyUpdate = {}
    let map = {
      current_square: currentSquare,
      visited: visited,
      moves: moveCount,
      complete: complete,
      id: this.props.map.info.id
    }
    partyUpdate.map = map
    if (recruit) {
      partyUpdate.recruit = recruit
    }
    partyUpdate.gold = this.props.gold + reward

    PartyAdapter.updateParty(this.props.party.partyId, partyUpdate)
       .then(this.props.resolveEncounter)
  }

  applyDamage = (enemy) => {
    let amount = this.state.spellcasting ? this.state.damage : 1

    if (enemy.health > 0 && !!this.state.damage) {
        let target = this.state.combatants.find(c => c === enemy)
        if (target.health - amount >= 0) {
          target.health -= amount
        } else {
          target.health = 0
        }

        let damage = this.state.damage - amount

        let spellcasting = !!damage ? false : true

        this.setState({
          damage: damage,
          spellcasting: spellcasting
        })
    }
    if (!this.npcAlive()) {
      this.resolveBattle()
    }
  }

  getHealed = (ally) => {
    if (this.state.healer) {
      let target = this.state.combatants.find(c => c === ally)
      if (target.health + 1 <= target.max_health) {
        target.health += 1
        this.state.healer.mana -= 1
        let healer = !!this.state.healer.mana ? this.state.healer : ""
        this.setState({ healer })
      }
    }
  }

  knightSpell = () => {
    if (this.state.combatants[this.state.currentTurn].mana > 2) {
      for (const combatant of this.state.combatants) {
        if (!combatant.party_id && combatant.health > 0) {
          combatant.health -= 1
        }
      }
      this.state.combatants[this.state.currentTurn].mana -= 3
      this.setState({})
    }
  }

  clericSpell = () => {
    if (this.state.combatants[this.state.currentTurn].mana > 0) {
      this.setState({
        healer: this.state.combatants[this.state.currentTurn]
      })
    }
  }

  rogueSpell = () => {
    if (this.state.combatants[this.state.currentTurn].mana > 3) {
      this.state.combatants[this.state.currentTurn].mana -= 4
      this.setState({
        rolling: true,
        spellcasting: false,
        rollCount: 0,
        rolls: [],
        locked: {0: false, 1: false, 2: false, 3: false, 4: false, 5: false}
      })
    }
  }

  mageSpell = () => {
    if (this.state.combatants[this.state.currentTurn].mana > 0) {
      let mana = this.state.combatants[this.state.currentTurn].mana
      let damage = mana * mana
      this.state.combatants[this.state.currentTurn].mana = 0
      this.setState({ damage })
    }
  }

  renderSpell = () => {
    switch(this.state.combatants[this.state.currentTurn].role) {
      case 'Knight':
        return <div className="magic-spell"><button onClick={this.knightSpell}>Whirlwind - 3 Mana</button></div>
      case 'Cleric':
        return <div className="magic-spell"><button onClick={this.clericSpell}>Minor Heal - 1 Mana</button></div>
      case 'Rogue':
        return <div className="magic-spell"><button onClick={this.rogueSpell}>Smoke Bomb - 4 Mana</button></div>
      case 'Mage':
        return <div className="magic-spell"><button onClick={this.mageSpell}>Fireball - All Mana</button></div>
    }
  }


  renderParty = () => {
    return this.props.allies.map(m => {
       return <div className={`battle-char battle-box ${m === this.state.combatants[this.state.currentTurn] ? "active-battler" : ""}`} onClick={() => this.getHealed(m)}><BattleCharacter character={m} /></div>
    })
  }

  renderEnemies = () => {
    return this.props.enemies.map(e => {
      return <div className={`battle-char battle-box ${e === this.state.combatants[this.state.currentTurn] ? "active-battler" : ""}`} onClick={() => this.applyDamage(e)}><BattleCharacter character={e} /></div>
    })
  }

  getBackdrop = () => {
    let width = Math.sqrt(this.props.map.map.layout.length/2)
    let arrLoc = this.props.selectedSquare[0] + this.props.selectedSquare[1]*width

    switch (this.props.map.map.layout[arrLoc*2]) {
      case "F":
        return "field-world"
      case "M":
        return "mountain-world"
      case "W":
        return "forest-world"
      case "S":
        return "swamp-world"
      case "C":
        return "castle-world"
    }
  }

  render() {
    return (
          <div>
            {this.props.allies
            ?
          <div className={`battle-container ${this.getBackdrop()}`}>
            {this.state.rolling || this.state.damage || this.state.spellcasting || this.props.questing ?
              null
              :
              <button id="start-button" onClick={this.takeTurns}>Start Battle</button>
             }
            <div className="top-filler-left"> </div>
            <div id="ally-label">ALLIES</div>
            <div className="allies-container">
              {this.renderParty()}
            </div>
            <div id="enemy-label">ENEMIES</div>
            <div className="enemies-container">
              {this.renderEnemies()}
            </div>
            <div className="top-filler-right"> </div>


            {this.state.rolling && this.state.rollCount < 3 ?
              <div id="dice-tray">
                <button id="roll-button" onClick={this.setDiceRoll}>Roll</button>
                {this.displayDiceRoll()}
              </div>
              :
              null
            }

            {!!this.state.damage && !this.props.questing ?
              <div id="damage-tray">
                <h2>Click An Enemy To Damage Them!</h2>
                <h3>Remaining Damage:</h3>
                <h1>{this.state.damage}</h1>
              </div>
              :
              null
            }

            {this.state.spellcasting ?
              <div id="spell-tray">
                <h2>Cast Your Class Spell!</h2>
                {this.renderSpell()}
                <button className="done-spellcasting" onClick={this.endSpellcasting}>Done</button>
              </div>
              :
              null
            }

            {this.props.questing ?
              <button id="battlefield-link-button" onClick={() => this.props.history.push('/battlefield')}>Back to the Map</button>
              :
              null
            }
            {this.state.result === "won" ?
              <div className="result">You Won! A New Member Has Joined Your Team.</div>
              :
              null
            }
            {this.state.result === "lost" ?
              <div className="result">You Lost. You'll Have To Try Again!</div>
              :
              null
            }
          </div>
          : <Redirect to='/party' />
          }
          </div>
    )
  }
 }

 const mapStateToProps = (state) => {

   let map = []
   if (state.party.maps.length) {
     map = state.party.maps.find(m => m.map.id === state.gameLogic.currentMap)
   }

   return {
     party: {
       inventory: state.party.party.inventory,
       allEquipment: state.party.equipment,
       partyId: state.party.party.id
     },
     gold: state.party.gold,
     enemies: state.gameLogic.enemyArr,
     allies: state.party.party.members,
     questing: state.gameLogic.questing,
     selectedSquare: state.gameLogic.selectedSquare,
     previousSquare: state.gameLogic.previousSquare,
     map: map,
     auth: {
       isLoggedIn: state.auth.isLoggedIn,
       user: state.auth.user
     }
   }
 }

 const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({
     resolveEncounter: resolveEncounter,
     damageEnemy: damageEnemy
   }, dispatch)
 }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Battle))
