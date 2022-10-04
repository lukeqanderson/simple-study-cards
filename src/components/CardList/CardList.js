import React, { Component } from "react";
import CardListItem from "../CardListItem/CardListItem";
import "./CardList.css";

class CardList extends Component {
    constructor() {
        super();
        this.state = {
            mode: "normal"
        }
    }

    switchModes = (mode) => {
        this.setState({mode:mode});
    }

    render() {
        const {mode} = this.state;
        const {decks, currentDeck, deleteCard, setToEditCardMode, addAndEditCard} = this.props;
        
        // function that maps through the decks to display the 
        // individual desks in a DeckList component
        const renderCardList= decks[currentDeck].cards.map((card, i) => { return (
                < CardListItem 
                    key={i}
                    id={i}
                    question={card[0]}
                    deleteCard = {deleteCard}
                    currentDeck = {currentDeck}
                    setToEditCardMode = {setToEditCardMode}
                />
            );
        })

    return (
        <div className="deck-list-container w-90 w-80-ns w-60-l br4 pb2 b--black-10 positioned bg-near-white shadow-3 pb4">
            <h2 className="pt2 mb1">{decks[currentDeck].name}</h2>
            <p 
            onClick={() => addAndEditCard(currentDeck)}
            className="f6 pointer ba br4 bw1 b--dark-green dim ph3 pv2 ma0 mb3 mt1 dib bg-light-green dark-green">Add New Card</p>
            {/* On normal mode, displays options to switch modes */}
            {mode === "normal"
            ?
            <div className="normal-mode-container">
                <p 
                    onClick={() => this.switchModes("card-list")} 
                    className="mr3 f6 pointer br4 ba bw1 b--dark-gray dim ph3 pv2 dib bg-moon-gray dark-gray">Show Cards</p>
                <p 
                    onClick={() => this.switchModes("study")} 
                    className="ml3 f6 pointer br4 ba bw1 b--dark-gray dim ph3 pv2 dib bg-moon-gray dark-gray">Study Now</p>
            </div>
            :
                (
                    // only shows card list if there are cards present
                    mode === "card-list" && decks[currentDeck].cards.length > 0
                    ? <div>
                        {renderCardList}
                    </div>
                    : <p>Deck is empty. Click "Add Card" to add a add a new card to this deck.</p>
                ) 
            }
        </div>
    );
    }
}

export default CardList;