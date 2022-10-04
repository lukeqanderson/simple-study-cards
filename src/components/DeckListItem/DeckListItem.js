import React from 'react';
import "./DeckListItem.css";

const DeckListItem = ({ name, id, toReviewCount, totalCount, deleteDeck, onDeckListItemSelection }) => {
    return (
        <div className="deck-list-item">
            <li
                onClick={() => onDeckListItemSelection(id)}
                className="deck-list-item deck-list-deck-link f6 ph3 pv2 bl bt bb b--light-silver mb1 bg-light-gray pointer">
                <p className="pa0 ma0">
                    <span className="b mr2">Deck {id}:</span>
                    {name}
                    {
                        // shows a special message to user can easily
                        //tell which decks need studing
                        toReviewCount > 0
                            ? <span className="blue i">
                                {"  ("} needs studying {")"}
                            </span>
                            : <></>
                    }
                </p>
                <p className="deck-list-review-count ma0">{toReviewCount} / {totalCount}</p>
            </li>
            <p onClick={() => deleteDeck(id-1)} className="f6 pointer ba b--black dim ph3 pv2 ma0 mb1 dib bg-dark-red black">Delete</p>
        </div>
    );
}

export default DeckListItem;