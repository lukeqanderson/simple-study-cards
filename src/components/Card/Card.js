import React from "react";
import "./Card.css";

const Card = ({decks, currentDeck, currentCard, editingCard, editingFromStudyingOrCardList, cardAnswerIsHidden, toggleHideAnswer, markAnswerCorrect, toggleEditMode, onEditCardQuestion, onEditCardAnswer, setEditsAndRoute}) => {

    return (
            <div className="card-container w-80 w-60-l br4 ba b--black-10 positioned bg-near-white shadow-3">
                <h1 className="f2 mb4">{decks[currentDeck].name}</h1>
                {editingCard === false && editingFromStudyingOrCardList === "studying"
                    ? <div>
                        <div className="review-counter-container mt2 mb2">
                            <p className="red try-again-counter b">Try Again: 10</p>
                            <p className="black studying-counter b">Studying: 20</p>
                            <p className="green finished-counter b">Finished: 5</p>
                        </div>
                        <hr className="review-counter-line-break" />
                        <div className="tr">
                            <p onClick={toggleEditMode}
                                className="f6 pointer br4 ba bw1 b--black dim ph3 pv2 mb2 dib white bg-blue">Edit</p>
                            <p className="f6 pointer ma2 mr3 br4 ba bw1 b--black dim ph3 pv2 mb2 dib white bg-dark-red">Delete</p>
                        </div>
                        <div>
                            <h2>{decks[currentDeck].cards[currentCard][0]}</h2>
                            {
                                cardAnswerIsHidden === true
                                    ? <p onClick={(toggleHideAnswer)}
                                        className="f6 pointer ma2 mb4 mr3 br4 ba bw1 b--black dim ph3 pv2 mb2 dib white bg-gray">Show Answer</p>
                                    : <div>
                                        <p className="f3">{decks[currentDeck].cards[currentCard][0]}</p>
                                        <div className="ma2 mb4">
                                            <p className="ma0 i">Did you get it correct?</p>
                                            <div className="correct-button-container">
                                                <div className="correct-button-no">
                                                    <p onClick={() => markAnswerCorrect(false)}
                                                        className="f6 pointer br4 ba bw1 b--dark-red dim ph3 pv2 mb2 dib bg-white dark-red">No</p>
                                                    <p className="ma0 i">Review again</p>
                                                </div>
                                                <div className="correct-button-yes">
                                                    <p onClick={() => markAnswerCorrect(true)}
                                                        className="f6 pointer br4 ba bw1 b--green dim ph3 pv2 mb2 dib bg-white green">Yes</p>
                                                    <p className="ma0 i">Review 3 days</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                    : <div>
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
                                className="f6 pointer ml1 br4 ba bw1 b--blue dim ph3 pv2 mb2 dib white bg-white blue">Done Editing</p>
                        </div>
                    </div>

                }
            </div>
        );
    }


export default Card;