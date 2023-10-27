import React from 'react';
import styled from 'styled-components';

export default function Footer() {
    return (
        <Container>
            Footer
        </Container>
    )
}

const Container = styled.div`
    padding: 20px 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0.05);
    border: 1.5px solid rgba(0, 0, 0, 0.1);
    border-bottom: none;
    border-radius: 20px 20px 0px 0px;

    margin-top: auto;
`