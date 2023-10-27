import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { styled } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NextUIProvider } from "@nextui-org/react";
import AuthHolder from './utils/AuthProvider';

import Header from "./components/Header";

import Home from './pages/Home';
import Login from './pages/Login';
import Error404 from './pages/Error404';
import BookTicket from './pages/BookTicket';
import Dashboard from './pages/Dashboard';


export default function App() {

    const AppendHeader = ({ Comp }) => {
        return (
            <>
                <Header />
                <Comp />
            </>
        )
    }

    const routes = [
        {
            path: '/',
            element: <AppendHeader Comp={Home} />,
        },
        {
            path: '/book',
            element: <AppendHeader Comp={BookTicket} />,
        },
        {
            path: '/login',
            element: <AppendHeader Comp={Login} />,
        },
        {
            path: '/dashboard',
            element: <AppendHeader Comp={Dashboard} />,
        },
        {
            path: '/dashboard/:tab',
            element: <AppendHeader Comp={Dashboard} />,
        },
        {
            path: '*',
            element: <Error404 />,
        },
    ];

    const router = createBrowserRouter(routes);

    return (
        <NextUIProvider>
            <AuthHolder>

                <Container className='light'>
                    <ToastContainer />
                    <RouterProvider router={router} />
                </Container>

            </AuthHolder>
        </NextUIProvider>
    )
}


const Container = styled.div`
    width: 100%;
    height: 100%;
    color: #000;

    max-width: 100vw;
    overflow-x: hidden;
    min-height: 100vh;
    box-sizing: border-box;
    scroll-behavior: smooth;
    font-family: Lato;

    display: flex;
    flex-direction: column;
`
