import React from "react";
import "./DeckList.css";
import DeckListItem from "../DeckListItem/DeckListItem";
import Scroll from "../Scroll/Scroll";


const DeckList = ({ decks, addingDeck, deleteDeck, toggleDeckCreation, onDeckListItemSelection, nameInputChanges, addDeck }) => {
    // function that maps through the decks to display the 
    // individual desks in a DeckList component
    const renderDeckList = decks.map((deck, i) => {
        return (
            < DeckListItem
                key={i}
                id={i + 1}
                name={deck.name}
                toReviewCount={deck.toReviewCount}
                totalCount={deck.totalCount}
                deleteDeck={deleteDeck}
                onDeckListItemSelection={onDeckListItemSelection}
            />
        );
    })

    return (
        <div className="deck-list-container w-90 w-80-ns w-60-l br4 pb2 b--black-10 positioned bg-near-white shadow-3">
            {
                addingDeck === false
                    ? <div>
                        <div className="deck-list-header-and-button">
                            <h2 className="deck-list-header mb0">Your Decks</h2>
                            <p onClick={toggleDeckCreation}
                                className="new-deck-button f6 pointer br4 ba bw1 b--dark-green dim ph3 pv2 mb2 dib bg-light-green dark-green">New Deck</p>
                        </div>
                        <hr className="deck-list-line-break" />
                        {
                            decks.length > 0
                                ?
                                <ul className="list pl0 ml0 center mw6">
                                    {/* renders deck list within scroll */}
                                    <Scroll>
                                        {renderDeckList}
                                    </Scroll>
                                </ul>
                                :
                                <p>You have no decks. Click "New Deck" above to build a deck.</p>
                        }
                    </div>
                    :
                    <div className="add-deck-container pt2">

                        <p className="deck-name-title f4">Name: </p>
                        <input
                            onChange={nameInputChanges}
                            className="deck-name-input f4"
                            name="deck-name"
                            type="text"
                        />
                        <p
                            onClick={addDeck}
                            className="deck-name-button f6 pointer br4 ba bw1 b--dark-gray dim ph3 pv2 dib bg-moon-gray dark-gray">Create Deck</p>
                    </div>
            }
        </div>
    );
}


export default DeckList;