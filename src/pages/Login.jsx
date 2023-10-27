import React, { useContext } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import { Button } from '@nextui-org/react';

export default function Login() {

    const { address, connected, user, logoutHandler, signInHandler } = useContext(AuthContext);

    return (
        <Profile
            connected={connected}
            user={user}
            address={address}
            logoutHandler={logoutHandler}
            signInHandler={signInHandler}
        />
    )
};

const Profile = ({ connected, user, address, logoutHandler, signInHandler }) => {

    return (
        <>{connected
            ? <>
                {user.name}
                <Button
                    color="danger"
                    variant="flat"
                    radius="sm"
                    spinnerPlacement="end"
                    className="w-min"
                    onClick={logoutHandler}
                >
                    Logout
                </Button>
            </>
            : <Button
                color="primary"
                variant="shadow"
                radius="sm"
                spinnerPlacement="end"
                className="w-min"
                onClick={signInHandler}
            >
                SignIn
            </Button>
        }</>
    )
};