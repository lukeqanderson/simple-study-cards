import React from "react";

const Register = ({ onRouteChange }) => {
    return (
        <div className="br4 ba b--black-10 mv4 w-80 w-60-m w-40-l mw6 center bg-near-white shadow-3">
            <div className="pa4">
                <div className="measure">
                    <fieldset id="register" className="ba b--transparent ph0 mh0">
                        <legend className="f4 fw6 ph0 mh0 center">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="username">Email Address</label>
                            <input className="pa2 input-reset ba bg-white hover-bg-white hover-black w-100" type="email" name="email-address" id="email-address" />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="username">Username</label>
                            <input className="pa2 input-reset ba bg-white hover-bg-white hover-black w-100" type="text" name="username" id="username" />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input className="b pa2 input-reset ba bg-white hover-bg-white hover-black w-100" type="password" name="password" id="password" />
                        </div>
                    </fieldset>
                    <div className="Name">
                        <input className="b ph3 pv2 input-reset ba b--black bg-moon-gray grow pointer f6 dib"
                            onClick={() => onRouteChange("signIn")} type="submit" value="Create Account" />
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Register;