import React from 'react';

const DeckListItem = ({ logNumber, deckName, startTime, endTime, rightAnswers, wrongAnswers }) => {
    return (
        <div className="pl2 pr2">
            <p className="tl"><span className="b">Session {logNumber}</span> - Deck: {deckName} | Start Time (UNIX timestamp in seconds): {startTime} | End Time (UNIX timestamp in seconds): {endTime} | Right Answer Count: {rightAnswers} | Wrong Answer Count: {wrongAnswers}</p>
            <hr></hr>
        </div>
    );
}

export default DeckListItem;