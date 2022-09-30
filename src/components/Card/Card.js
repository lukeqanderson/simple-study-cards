import React, { Component } from "react";
import "./Card.css";

class Card extends Component {
    constructor() {
        super();
        this.state = {
            editing: false,
            isHidden: true,
            isCorrect: null
        }
    }

    render() {
        // destructures state and props
        const { question, answer, onEditCardQuestion, onEditCardAnswer } = this.props;
        const { isHidden, editing } = this.state;

        // toggle whether answer is hidden
        const hideAnswer = (isHidden) => {
            this.setState({ isHidden: isHidden });
        }

        // function to change isCorrect state
        const markAnswerCorrect = (answerIsRight) => {
            this.setState({ isCorrect: answerIsRight });
        }

        // function to toggle between editing and display mode
        const toggleEditMode = () => {
            // gets the opposite of the current editing mode we are in
            const oppositeMode = !this.state.editing;
            this.setState({ editing: oppositeMode })
            // hides answer after editing
            hideAnswer(true);
        }

        return (
            <div className="card-container w-80 w-60-l br4 ba b--black-10 positioned bg-near-white shadow-3">
                {editing === false
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
                            <h2>{question}</h2>
                            {
                                isHidden === true
                                    ? <p onClick={() => hideAnswer(false)}
                                        className="f6 pointer ma2 mb4 mr3 br4 ba bw1 b--black dim ph3 pv2 mb2 dib white bg-gray">Show Answer</p>
                                    : <div>
                                        <p className="f3">{answer}</p>
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
                    :
                    <div>
                        <div>
                            <h2>Question: </h2>
                            <input
                                name="question"
                                defaultValue={question}
                                type="text"
                                onChange={onEditCardQuestion}
                            />
                            <h2>Answer: </h2>
                            <input
                                name="answer"
                                defaultValue={answer}
                                type="text"
                                onChange={onEditCardAnswer}
                            />
                        </div>
                        <div className="ma2 mb4">
                            <p onClick={toggleEditMode}
                                className="f6 pointer ml1 br4 ba bw1 b--blue dim ph3 pv2 mb2 dib white bg-white blue">Done Editing</p>
                        </div>
                    </div>

                }
            </div>
        );
    }
}

export default Card;