import React from "react";

// Navbar component to allow the user to switch between different 
// pages. Parameters are destructed props passed in from App.js.
const NavigationBar = ({ onRouteChange, isSignedIn }) => {
    return (
        <nav className="flex justify-between">
            <p className="link white-70 hover-white no-underline flex items-center pa3"></p>
            {/* displays different nav components depending on if user is signed in or not */}
            {isSignedIn === true ?
                <div className="flex-grow pa3 flex items-center pointer">
                    <p onClick={() => onRouteChange("home")}
                        className="f10 link dib white dim mr3 mr4-ns pointer">Home</p>
                    <p onClick={() => onRouteChange("decks")}
                        className="f10 link dib white dim mr3 mr4-ns pointer">Decks</p>
                    <p onClick={() => onRouteChange("decks")}
                        className="f10 link dib white dim mr3 mr4-ns pointer">Upgrade</p>
                    <p onClick={() => onRouteChange("decks")}
                        className="f10 link dib white dim mr3 mr4-ns pointer">Settings</p>
                    <p onClick={() => onRouteChange("signOut")}
                        className="f10 link dib white dim mr3 mr4-ns pointer">Sign Out</p>
                </div>
                :
                <div className="flex-grow pa3 flex items-center pointer">
                    <p onClick={() => onRouteChange("signIn")}
                        className="f10 link dib white dim mr3 mr4-ns pointer">Sign In</p>
                    <p onClick={() => onRouteChange("register")}
                        className="f10 link dib white dim mr3 mr4-ns pointer">Register</p>
                </div>
            }
        </nav>
    );
}

export default NavigationBar;