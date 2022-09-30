import React from "react";
//imports time stamp for easy time tracking
//note, to use time do timestamp.utc('YYYYMMDDHHmm')
const timestamp = require('time-stamp');


const DeckList = () => {
    return (
        <div className="deck-list-container w-90 w-80-ns w-60-l br4 pb2 b--black-10 positioned bg-near-white shadow-3">
            <h1>Card List</h1>
        </div>
    );
}

export default DeckList;