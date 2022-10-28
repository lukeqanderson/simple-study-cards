import React, { Component } from "react";
import CardListItem from "../CardListItem/CardListItem";

class CardList extends Component {

    render() {
        const { decks, currentDeck, deleteCard, setToEditCardMode, addAndEditCard, setAndRenderStudy } = this.props;

        // function that maps through the decks to display the 
        // individual desks in a DeckList component
        const renderCardList = decks[currentDeck].cards.map((card, i) => {
            return (
                < CardListItem
                    key={i}
                    id={i}
                    question={card[0]}
                    deleteCard={deleteCard}
                    currentDeck={currentDeck}
                    setToEditCardMode={setToEditCardMode}
                />
            );
        })

        return (
            <div className="deck-list-container w-90 w-80-ns w-60-l br4 pb2 b--black-10 positioned bg-near-white shadow-3 pb4">
                <h2 className="pt2 mb1">{decks[currentDeck].name}</h2>
                <p
                    onClick={() => addAndEditCard(currentDeck)}
                    className="f6 pointer ba br4 bw1 b--dark-gray dim ph3 pv2 ma0 mb3 mt1 dib bg-moon-gray dark-gray">Add New Card</p>
                <p
                    onClick={() => setAndRenderStudy(currentDeck)}
                    className="ml3 f6 pointer br4 ba bw1 b--dark-gray dim ph3 pv2 dib bg-moon-gray dark-gray">Study Now</p>
                {decks[currentDeck].cards.length > 0
                    ? <div>
                        {renderCardList}
                    </div>
                    : <p>Deck is empty. Click "Add Card" to add a add a new card to this deck.</p>
                }
            </div>
        );
    }
}

export default CardList;