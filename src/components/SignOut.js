import React from 'react';
import { auth } from '../firebase/index';

const SignOutButton = () =>
    <a
        href="#a"
        onClick={auth.doSignOut}
    >
        Sign Out
    </a>

export default SignOutButton;