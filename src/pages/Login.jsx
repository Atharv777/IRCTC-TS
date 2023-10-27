import React, { useContext } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import { Input, Button, Image, Card, CardHeader, CardBody, CardFooter, Avatar, Link, Divider } from '@nextui-org/react';

import ill from "../assets/img/login_illustration.png";
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const { address, connected, user, logoutHandler, signInHandler } = useContext(AuthContext);
    const navigate = useNavigate()

    return (

        connected && user
            ? <Card className="px-[70px] py-[30px] m-auto">
                <CardHeader className="flex flex-col items-center gap-3 w-full py-5" >
                    <Avatar
                        isBordered
                        className="transition-transform"
                        color="default"
                        radius="sm"
                        size="lg"
                        name={user.name}
                        src={user.profileImage}
                    />
                    <p>Logged in as {user.name}</p>
                </CardHeader >
                <CardFooter className="flex flex-col gap-3 w-full">
                    <Button
                        color="primary"
                        variant="solid"
                        radius="sm"
                        size="md"
                        className="w-full text-base font-medium"
                        onClick={() => navigate("/dashboard")}
                    >
                        Go to Dashboard
                    </Button>
                    <Button
                        color="danger"
                        variant="flat"
                        radius="sm"
                        size="md"
                        className="w-full text-base font-medium"
                        onClick={logoutHandler}
                    >
                        Logout
                    </Button>
                </CardFooter>
            </Card >
            : <Card className="px-[100px] py-[30px] m-auto">
                < CardHeader className="flex flex-col items-center gap-3 w-full py-5" >
                    <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src={ill}
                        width={300}
                    />
                </CardHeader >
                <CardFooter className='flex flex-col gap-5'>
                    <Button
                        color="default"
                        variant="ghost"
                        radius="sm"
                        className="w-full text-md font-medium"
                        onClick={() => signInHandler("user")}
                    >
                        Sign In with google
                        <FcGoogle className='text-xl' />

                    </Button>
                    <div className='flex flex-row w-full justify-center items-center gap-5'>
                        <Button
                            color="primary"
                            variant="solid"
                            radius="sm"
                            className="w-full text-md font-medium"
                            onClick={() => signInHandler("vendor")}
                        >
                            Login as Vendor
                        </Button>

                        <p>OR</p>

                        <Button
                            color="primary"
                            variant="solid"
                            radius="sm"
                            className="w-full text-md font-medium"
                            onClick={() => signInHandler("staff")}
                        >
                            Login as Staff
                        </Button>

                    </div>
                </CardFooter>
            </Card >



    )
};