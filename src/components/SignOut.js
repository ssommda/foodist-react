import React from 'react';

import { auth } from '../firebase/index';

const SignOutButton = () =>
    <a
        href="javascript:void(0)"
        onClick={auth.doSignOut}
    >
        로그아웃
    </a>

export default SignOutButton;