import React from "react";
import "./Home.css";

const Home = ({ onRouteChange }) => {
    return (
        <div className="home-container br4 ba b--black-10 w-80 w-60-l positioned bg-near-white shadow-3">
            <div className="pa4">
                <div className="measure center">
                    <div className="ba b--transparent ph0 mh0">
                        <h2>Welcome to Simple Study Cards!</h2>
                        <p>This web application allows you to create decks of cards that you
                            can use to study various topics.
                        </p>
                        <p>The application uses a Spaced Repetition System which is scientifically proven
                            to help you retain information.
                        </p>
                        <p>Spaced Repetition works by increasing the time between reviews on cards you get correct
                            while decreasing the time between reviews for cards you get incorrect.
                        </p>
                        <p>
                            By spacing out reviews, you're able to commit the information to long-term memory,
                            maximizing memorization and minimizing study time.
                        </p>
                        <p className="b">
                            Ready to get started? Click on the "Decks" button to create a new deck of cards.
                        </p>
                    </div>
                    <div className="Name">
                        <input className="b ph3 pv2 input-reset ba b--black bg-moon-gray grow pointer f6 dib"
                            onClick={() => onRouteChange("decks")} type="submit" value="Decks" />
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Home;