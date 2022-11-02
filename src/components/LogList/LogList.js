import React from "react";
import Log from "../Log/Log";
import Scroll from "../Scroll/Scroll";
import "./LogList.css";


const LogList = ({ logs, onRouteChange }) => {
    // function that maps through the decks to display the 
    // individual desks in a DeckList component
    const renderLogs = logs.map((log, i) => {
        return (
            < Log
                key={i}
                logNumber={logs.length - i}
                deckName={log.deckName}
                startTime={log.startTime}
                endTime={log.endTime}
                rightAnswers={log.rightAnswers}
                wrongAnswers={log.wrongAnswers}
            />
        );
    })

    return (
        <div className="log-list-container w-90 w-80-ns w-60-l br4 pb2 b--black-10 positioned bg-near-white shadow-3">
            <div className="log-list-header-and-button">
                <h2 className="log-list-header mb0">Study Session Logs</h2>

                <p onClick={() => onRouteChange("stats")}
                    className="log-list-button f6 pointer br4 ba bw1 b--dark-gray dim ph3 pv2 mb2 dib bg-light-gray dark-gray">Back</p>

            </div>
            <hr className="log-list-line-break" />
            <ul className="list pl0 ml0 center mw6">
                {/* renders deck list within scroll */}
                <Scroll>
                    {renderLogs}
                </Scroll>
            </ul>





        </div>
    );
}


export default LogList;