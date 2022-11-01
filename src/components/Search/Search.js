import React, { Component } from "react";
import CardListItem from "../CardListItem/CardListItem";
import Scroll from "../Scroll/Scroll";

class Search extends Component {

    render() {
        const { decks, searchField, onSearchChange, deleteCard, setToEditCardMode } = this.props;

        // function that maps through the decks to display the 
        // individual desks in a DeckList component
        const renderCardList =
            decks.map((deck, i) => {
                return (
                    deck.cards.map((card, j) => {
                        return (
                            // searches both the question and answer of each card for a match to the search
                            card[0].toLowerCase().includes(searchField.toLowerCase())
                                || card[1].toLowerCase().includes(searchField.toLowerCase())
                                ? < CardListItem
                                    key={(i + 1) * (j + 1) + j}
                                    id={j}
                                    question={card[0]}
                                    deleteCard={deleteCard}
                                    currentDeck={i}
                                    setToEditCardMode={setToEditCardMode}
                                />
                                // return an empty tag when not found
                                : <React.Fragment key={(i + 1) * (j + 1) + j}></React.Fragment>
                        );
                    })
                )
            })



        return (
            <div className="deck-list-container w-90 w-80-ns w-60-l br4 pb2 b--black-10 positioned bg-near-white shadow-3 pb4">
                <h2 className="pt2 mb2 pt3">Search</h2>
                <input
                    className="ba br4 b--black-20 pa2 mb3 db w-50 center"
                    type="text"
                    placeholder="Search all cards..."
                    defaultValue={searchField}
                    onChange={onSearchChange}></input>
                <div>
                    {/* renders card list within scroll */}
                    <Scroll>

                        {renderCardList}
                    </Scroll>
                </div>
            </div>
        );
    }
}

export default Search;