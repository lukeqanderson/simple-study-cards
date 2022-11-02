import React, { Component } from "react";
import "./Stats.css";
import Scroll from "../Scroll/Scroll";


class Stats extends Component {
    render() {
        // pulls logs
        const { logs, readableStats, onRouteChange } = this.props;
        return (
            <div className="stats-container w-90 w-80-ns w-60-l br4 pb2 b--black-10 positioned bg-near-white shadow-3">

                <div>
                    <div className="stats-header-and-button">
                        <h2 className="stats-header mb0">Study Statistics</h2>
                        {
                            //only renders option to show logList if the account has log files
                            logs.length === 0
                                ? <></>
                                : <p onClick={() => onRouteChange("logList")}
                                    className="log-button f6 pointer br4 ba bw1 b--dark-gray dim ph3 pv2 mb2 dib bg-light-gray dark-gray">Show Logs</p>
                        }
                    </div>
                    <hr className="stats-line-break" />
                    {
                        // if logs exist we can generate stats
                        logs.length > 0
                            ?
                            <ul className="pl2 pr2 center mw6">
                                {/* renders deck list within scroll */}
                                <Scroll>
                                    {
                                        <div>
                                            <h3>Total time studied:</h3>
                                            <p>{readableStats.totalStudyTime}</p>
                                            <br />
                                            <h3>Total answers submitted:</h3>
                                            <p>{readableStats.totalAnswers}</p>
                                            <br />
                                            <h3>Correct answer percentage:</h3>
                                            <p>{readableStats.correctAnswerRatio}</p>
                                            <br />
                                            <h3>Average time per answer:</h3>
                                            <p>{readableStats.averageTimePerAnswer}</p>
                                            <br />
                                            <h3>Deck with highest correct answer percentage:</h3>
                                            <p>{readableStats.bestDeck}</p>
                                            <br />
                                            <h3>"{readableStats.bestDeck}" correct answer percentage:</h3>
                                            <p>{readableStats.bestDeckRatio}</p>
                                            <br />
                                            <h3>Deck with lowest correct answer percentage:</h3>
                                            <p>{readableStats.worstDeck}</p>
                                            <br />
                                            <h3>"{readableStats.worstDeck}" correct answer percentage:</h3>
                                            <p>{readableStats.worstDeckRatio}</p>
                                            <br />
                                            <p className="i gray">"Success isn’t always about greatness. It’s about consistency. Consistent hard work leads to success. Greatness will come."</p>
                                            <p className="b gray">- Dwayne "The Rock" Johnson</p>
                                        </div>
                                    }
                                </Scroll>
                            </ul>
                            :
                            <p>You have no recorded study sessions. Study some cards to show stats.</p>
                    }
                </div>

            </div >
        );
    }
}


export default Stats;