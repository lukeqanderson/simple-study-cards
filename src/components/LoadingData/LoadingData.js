import React, { Component } from "react";

// page for initial sign on to load state
class LoadingData extends Component {

    // initializes that data from the state
    componentDidMount = () => {
        this.props.fetchUserData();
        this.props.onRouteChange(this.props.route);
    }

    render() {


        return (
            <div >
                <h1>Loading... Please wait...</h1>
            </div >
        );
    }
}

export default LoadingData;