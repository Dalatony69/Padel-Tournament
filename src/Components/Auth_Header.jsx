import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function AuthHeader(){
    return(
        <>
            <Navbar className="navbar" bg="light" data-bs-theme="dark">
                <Container className="d-flex">
                    <Navbar.Brand className="header-brand">Sparx</Navbar.Brand>
                </Container>
            </Navbar>
        </>
    );
}

export default AuthHeader;