import React, { useContext } from 'react';
import { NavLink, Link as RRDLink } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Image, Avatar, Tooltip } from "@nextui-org/react";

import IrctcLogo from "../assets/img/irctc_logo.png"
import { AuthContext } from '../utils/AuthProvider';


export default function Header() {

    const { connected, user } = useContext(AuthContext)

    return (
        <Navbar
            classNames={{
                item: [
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
                    "data-[active=true]:after:content-['']",
                    "data-[active=true]:after:absolute",
                    "data-[active=true]:after:bottom-0",
                    "data-[active=true]:after:-left-[15%]",
                    "data-[active=true]:after:w-[130%]",
                    "data-[active=true]:after:h-[2.5px]",
                    "data-[active=true]:after:rounded-[5px]",
                    "data-[active=true]:after:bg-primary",
                    "data-[active=true]:font-bold",
                ],
            }}
            shouldHideOnScroll
            maxWidth="full"
            isBordered={true}
        >
            <NavbarBrand>
                <Image
                    alt="IRCTC Logo"
                    src={IrctcLogo}
                    width={150}
                />
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-[40px]" justify="center">
                <NavLink to="/" className="h-full">
                    {({ isActive }) => (
                        <NavbarItem isActive={isActive} className='font-normal'>
                            <Link color={isActive ? "primary" : "foreground"}>
                                Home
                            </Link>
                        </NavbarItem>
                    )}
                </NavLink>
                <NavLink to="/book" className="h-full">
                    {({ isActive }) => (
                        <NavbarItem isActive={isActive} className='font-normal'>
                            <Link color={isActive ? "primary" : "foreground"}>
                                Book
                            </Link>
                        </NavbarItem>
                    )}
                </NavLink>
                <NavLink to="/login" className="h-full">
                    {({ isActive }) => (
                        <NavbarItem isActive={isActive} className='font-normal'>
                            <Link color={isActive ? "primary" : "foreground"}>
                                Customers
                            </Link>
                        </NavbarItem>
                    )}
                </NavLink>
            </NavbarContent>

            <NavbarContent justify="end">
                {
                    connected && user
                        ? <NavbarItem>
                            <RRDLink to="/dashboard">
                                <Tooltip
                                    placement="bottom"
                                    content="User Dashboard"
                                    color="foreground"
                                    showArrow={true}
                                    delay={0}
                                >
                                    <Avatar
                                        isBordered
                                        className="transition-transform"
                                        color="default"
                                        radius="sm"
                                        size="md"
                                        name={user.name}
                                        src={user.profileImage}
                                    />
                                </Tooltip>
                            </RRDLink>
                        </NavbarItem>
                        : <NavbarItem>
                            <RRDLink to="/login">
                                <Button color="primary" variant="ghost" radius="md" className="px-7 font-bold text-md">
                                    Log In
                                </Button>
                            </RRDLink>
                        </NavbarItem>
                }

            </NavbarContent>
        </Navbar>
    )
}