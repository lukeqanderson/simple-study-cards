import React, { Component } from "react";
import "./DeckList.css";
import DeckListItem from "../DeckListItem/DeckListItem";
//imports time stamp for easy time tracking
//note, to use time do timestamp.utc('YYYYMMDDHHmm')
const timestamp = require('time-stamp');


class DeckList extends Component {
    constructor() {
        super();
        // holds the list of decks as well as details about
        // the contents of each deck
        this.state = {
            decks: [{
                name: "Science",
                cards: [
                    "What is the powerhouse of a cell?",
                    "Mitochondria",
                    202309290544,
                    "What is the symbol for water?",
                    "H2O",
                    202309290544,
                    "What is the symbol for iron?",
                    "fe",
                    202210290544
                ],
                toReviewCount: 0,
                totalCount: 3
            },
            {
                name: "History",
                cards: [
                    "What year did WW2 end?",
                    "1945",
                    202209290544,
                    "What year did America declare independence?",
                    "1776",
                    202209290544
                ],
                toReviewCount: 2,
                totalCount: 2
            },
            {
                name: "Geography",
                cards: [],
                toReviewCount: 0,
                totalCount: 0
            }
            ],
            addingDeck: false,
            newDeckName: ""
        }
    }

    // function to delete card at a certain index
    deleteCard = (startingIndex) => {
        let newDeck = [];
        //only splices if there are cards to delete
        if (this.state.decks.length > 1) {
            this.state.decks.splice(startingIndex, 1);
            newDeck = this.state.decks;
        }
        // sets state to new deck to force rerender
        this.setState({ decks: newDeck });
    }

    //function to toggle deck creation mode
    toggleDeckCreation = () => {
        this.setState({ addingDeck: !this.state.addingDeck });
    }

    //function to capture changes in name
    nameInputChanges = (event) => {
        this.setState({ newDeckName: event.target.value });
    }

    //function to add deck to deck list
    addDeck = () => {
        // creates new empty deck with name
        const newObject = {
            name: this.state.newDeckName,
            cards: [],
            toReviewCount: 0,
            totalCount: 0
        }
        // adds deck to state
        this.state.decks.push(newObject);
        // toggles deck creation
        this.toggleDeckCreation();
    }

    render() {
        // function that maps through the decks to display the 
        // individual desks in a DeckList component
        const renderDeckList = this.state.decks.map((deck, i) => {
            return (
                < DeckListItem
                    key={i}
                    id={i + 1}
                    name={deck.name}
                    toReviewCount={deck.toReviewCount}
                    totalCount={deck.totalCount}
                    deleteCard={this.deleteCard}
                />
            );
        })

        return (
            <div className="deck-list-container w-90 w-80-ns w-60-l br4 pb2 b--black-10 positioned bg-near-white shadow-3">
                {
                    this.state.addingDeck === false
                        ? <div>
                            <div className="deck-list-header-and-button">
                                <h2 className="deck-list-header mb0">Your Decks</h2>
                                <p onClick={this.toggleDeckCreation}
                                    className="new-deck-button f6 pointer br4 ba bw1 b--dark-green dim ph3 pv2 mb2 dib bg-light-green dark-green">New Deck</p>
                            </div>
                            <hr className="deck-list-line-break" />
                            {
                                this.state.decks.length > 0
                                    ?
                                    <ul className="list pl0 ml0 center mw6">
                                        {renderDeckList}
                                    </ul>
                                    :
                                    <p>You have no decks. Click "New Deck" above to build a deck.</p>
                            }
                        </div>
                        :
                        <div className="add-deck-container pt2">

                            <p className="deck-name-title f4">Name: </p>
                            <input
                                onChange={this.nameInputChanges}
                                className="deck-name-input f4"
                                name="deck-name"
                                type="text"
                            />
                            <p
                                onClick={this.addDeck}
                                className="deck-name-button f6 pointer br4 ba bw1 b--dark-gray dim ph3 pv2 dib bg-moon-gray dark-gray">Create Deck</p>
                        </div>
                }
            </div>
        );
    }
}

export default DeckList;