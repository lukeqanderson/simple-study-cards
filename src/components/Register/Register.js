import React, { Component } from "react";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            buttonDisabled: false
        }
    }

    // function to update state on email change
    onRegisterEmailChange = (event) => {
        this.setState({ email: event.target.value })
    }

    // function to disable button on submit to prevent spam and too many request to backend
    timeOutButton = () => {
        this.setState({ buttonDisabled: true });
        setTimeout(() => {
            this.setState(() => ({
                buttonDisabled: false,
            }));
        }, 5000);
    }

    // function to update state on username change
    onRegisterUsernameChange = (event) => {
        this.setState({ username: event.target.value })
    }

    // function to update state on password change
    onRegisterPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    // sends sign in information to backend
    onRegister = () => {
        // checks form for missing data
        if (this.state.username.length === 0 || this.state.username.length === 0 || this.state.password.length === 0) {
            alert("Please fill out all section of the form to register.")
        }
        // regex test to validate email
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)) {
            alert("Please enter a valid email address");
        }
        // tests for valid password length
        else if (this.state.password.length < 8 || this.state.password.length > 20) {
            alert("Password must be between 8 - 20 characters long");
        }
        else {
            this.timeOutButton();
            // checks registration information with backend
            fetch(process.env.REACT_APP_BACKEND_URL + 'register', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                // sends items in json
                body: JSON.stringify({
                    email: this.state.email,
                    username: this.state.username,
                    password: this.state.password
                })
            })
                .then(res => res.json())
                // only registers if response from server is a success
                .then(data => {
                    alert(data);
                    if (data === 'Account Created!') {
                        // routes to log in on successful registration
                        this.props.onRouteChange("signIn");
                    }
                })
        }
    }
    render() {
        return (
            <div className="br4 ba b--black-10 mv4 w-80 w-60-m w-40-l mw6 center bg-near-white shadow-3">
                <div className="pa4">
                    <div className="measure">
                        <fieldset id="register" className="ba b--transparent ph0 mh0">
                            <legend className="f4 fw6 ph0 mh0 center">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="username">Email Address</label>
                                <input
                                    onChange={this.onRegisterEmailChange}
                                    className="pa2 input-reset ba bg-white hover-bg-white hover-black w-100" type="email" name="email-address" id="email-address" />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="username">Username</label>
                                <input
                                    onChange={this.onRegisterUsernameChange}
                                    className="pa2 input-reset ba bg-white hover-bg-white hover-black w-100" type="text" name="username" id="username" />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input
                                    onChange={this.onRegisterPasswordChange}
                                    className="b pa2 input-reset ba bg-white hover-bg-white hover-black w-100" type="password" name="password" id="password" />
                                <p className="gray">Password must be 8-20 characters long</p>
                            </div>
                        </fieldset>
                        <div className="Name">
                            <input className="b ph3 pv2 input-reset ba b--black bg-moon-gray grow pointer f6 dib"
                                disabled={this.state.buttonDisabled}
                                onClick={this.onRegister} type="submit" value="Create Account" />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Register;