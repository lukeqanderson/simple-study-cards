import React from 'react';
import "./CardListItem.css";

const CardListItem = ({ question, id, deleteCard, currentDeck, setToEditCardMode }) => {
    return (
        <div className="card-list-item">
            <li
                className="card-list-item f6 ph3 pv2 bl bt bb b--light-silver mb1 bg-light-gray">
                <p className="pa0 ma0">
                    <span className="b mr2">Question: </span>
                    {question}
                </p>
                <p className="card-list-review-count ma0"></p>
            </li>
            <p
                onClick={() => setToEditCardMode(id)}
                className="f6 pointer ba b--black dim ph3 pv2 ma0 mb1 dib bg-moon-gray black">Edit</p>
            <p
                onClick={() => deleteCard(currentDeck, id)}
                className="f6 pointer ba b--black dim ph3 pv2 ma0 mb1 dib bg-dark-red black">Delete</p>
        </div>
    );
}

export default CardListItem;