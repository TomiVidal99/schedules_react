import React from 'react';
import {handle_signin_google, handle_logout} from './Authentication';

import './../styles/AuthContainer.css';

const AuthContainer = ({user}) => {

    const login_container = (
        <button onClick={handle_signin_google} className="btn login_btn auth__btn">
            login
        </button>
    );

    const logout_container = (
        <button onClick={handle_logout} className="btn logout_btn auth__btn">
            logout
        </button>
    );

    return(
        <div className="auth-container column">
            {user ? logout_container : login_container}
            <div className="auth__arrow"></div>
            <div className="auth__user row jc-sb">
                {user ? <p className="user__username ta-c">{user.multiFactor.user.displayName}</p> : null}
                {user ? <img className="user__logo" alt="user logo" src={user.multiFactor.user.photoURL}></img> : null}
            </div>
        </div>
    )
}

export default AuthContainer;
