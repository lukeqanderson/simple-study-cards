import React from "react";
import "./Card.css";

const Card = ({ decks, currentDeck, currentCard, editingCard, cardAnswerIsHidden, toggleHideAnswer, onEditCardQuestion, onEditCardAnswer, setEditsAndRoute, displayDaysUntilNextReview, wrongAnswer, rightAnswer, changeRouteDecks }) => {

    return (
        <div className="card-container w-80 w-60-l br4 ba b--black-10 positioned bg-near-white shadow-3">
            <h1 className="f2 mb4">{decks[currentDeck].name}</h1>
            {editingCard === false && decks[currentDeck].studying.length !== 0
                ? <div>
                    <div className="review-counter-container mt2 mb2">
                        <p className="gray studying-counter b">Cards remaining: {decks[currentDeck].studying.length}</p>
                    </div>
                    <hr className="review-counter-line-break" />
                    <div>
                        <h2>{decks[currentDeck].cards[decks[currentDeck].studying[0]][0]}</h2>
                        {
                            cardAnswerIsHidden === true
                                ? <p onClick={(toggleHideAnswer)}
                                    className="f6 pointer ma2 mb4 mr3 br4 ba bw1 b--black dim ph3 pv2 mb2 dib white bg-gray">Show Answer</p>
                                : <div>
                                    <p className="f3">{decks[currentDeck].cards[decks[currentDeck].studying[0]][1]}</p>
                                    <div className="ma2 mb4">
                                        <p className="ma0 i">Did you get it correct?</p>
                                        <div className="correct-button-container">
                                            <div className="correct-button-no">
                                                <p onClick={() => wrongAnswer(currentDeck)}
                                                    className="f6 pointer br4 ba bw1 b--dark-red dim ph3 pv2 mb2 dib bg-white dark-red">No</p>
                                                <p className="ma0 i">Review</p>
                                                <p className="ma0 i">Again</p>
                                            </div>
                                            <div className="correct-button-yes">
                                                <p onClick={() => rightAnswer(currentDeck)}
                                                    className="f6 pointer br4 ba bw1 b--green dim ph3 pv2 mb2 dib bg-white green">Yes</p>
                                                <p className="ma0 i">Review in</p>
                                                <p className="ma0 i">{displayDaysUntilNextReview(currentDeck, decks[currentDeck].studying[0])}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
                :
                (
                    editingCard === true ?
                        <div>
                            <div>
                                <p>Question: </p>
                                <input
                                    name="question"
                                    defaultValue={decks[currentDeck].cards[currentCard][0]}
                                    type="text"
                                    onChange={onEditCardQuestion}
                                />
                                <p>Answer: </p>
                                <input
                                    name="answer"
                                    defaultValue={decks[currentDeck].cards[currentCard][1]}
                                    type="text"
                                    onChange={onEditCardAnswer}
                                />
                            </div>
                            <div className="ma2 mb4">
                                <p
                                    onClick={() => setEditsAndRoute(currentDeck, currentCard)}
                                    className="f6 pointer ml1 br4 ba bw1 b--blue dim ph3 pv2 mb2 dib white bg-white blue">Update Card</p>
                            </div>
                        </div>
                        :
                        <div>
                            <p>Studying completed!</p>
                            <p
                                onClick={changeRouteDecks}
                                className="f6 pointer br4 mt0 mb4 ba bw1 b--dark-gray dim ph3 pv2 dib bg-moon-gray dark-gray">Decks</p>

                        </div>
                )

            }
        </div>
    );
}


export default Card;