import React from "react";
import Character from "./Character"

class BattleCharacter extends React.Component {

  render() {
    return (
      <div className={`battle-character-container ${!!this.props.character.health ? "" : "dead"}`}>
        <div className="avatar-container">
          <div className={`party-display-char-avatar ${this.props.character.role}-avatar`}>
            <Character character={this.props.character} />
          </div>
        </div>
        <h3 className="battle-name">{this.props.character.name}</h3>

        <div className="battle-stats">
          <div className="health-bar"><div className="heart"></div>{this.props.character.health}</div>
          <div className="mana-bar"><div className="mana"></div>{this.props.character.mana}</div>
        </div>
      </div>
    )
  }
}

export default BattleCharacter
