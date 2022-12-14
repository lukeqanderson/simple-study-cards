import React, { Component } from "react";

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    // function to update state on email change
    onSigninUsernameChange = (event) => {
        this.setState({ username: event.target.value })
    }

    // function to update state on password change
    onSigninPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    // sends sign in information to backend
    onSubmitSignIn = () => {
        // checks sign in information with backend
        fetch(process.env.REACT_APP_BACKEND_URL + 'signin', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            // sends items in json
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
            .then(res => res.json())
            // only sign in if response from server is a success
            .then(data => {
                if (data === 'Login successful') {
                    // sets current User on successful route change
                    this.props.onRouteChange("loadingData");
                    this.props.setCurrentUser(this.state.username);
                }
                else {
                    // alerts user of server response
                    alert(data);
                }
            })


    }

    render() {
        const { onRouteChange } = this.props;
        return (
            <div className="br4 ba b--black-10 mv4 w-80 w-60-m w-40-l mw6 center bg-near-white shadow-3">
                <div className="pa4">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f4 fw6 ph0 mh0 center">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="username">Username</label>
                                <input
                                    onChange={this.onSigninUsernameChange}
                                    className="pa2 input-reset ba bg-white hover-bg-white hover-black w-100" type="text" name="username" id="username" />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input
                                    onChange={this.onSigninPasswordChange}
                                    className="b pa2 input-reset ba bg-white hover-bg-white hover-black w-100" type="password" name="password" id="password" />
                            </div>
                        </fieldset>
                        <div className="Name">
                            <input className="b ph3 pv2 input-reset ba b--black bg-moon-gray grow pointer f6 dib"
                                onClick={this.onSubmitSignIn} type="submit" value="Sign in" />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={() => onRouteChange("register")} className="f6 link dim black db pointer">Register</p>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default SignIn;