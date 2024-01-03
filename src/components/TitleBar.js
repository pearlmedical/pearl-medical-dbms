// components/TitleBar.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useAuth } from '@/context/AuthContext';

const TitleBar = () => {
    const { isLoggedIn,logout } = useAuth();

    return (
        <>
            <Navbar bg="primary" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/">
                        <div style={{ display: 'flex',alignItems: 'flex-start',color: 'white',padding: '0rem',textAlign: 'center' }}>
                            <img
                                alt=""
                                src="/OIG-removebg-preview.png"
                                width="50"
                                height="50"
                                className="d-inline-block align-top"
                            // style={{ marginLeft: '1rem' }}
                            />
                            <h1 style={{ marginLeft: '1rem' }}>Pearl Medical</h1>
                        </div>
                    </Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav" style={{ fontSize: '1.4rem' }}>
                        <Nav className="ml-auto" variant='tabs'>
                            <Nav.Item>
                                <Nav.Link href="/">Home</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/sales">Sales</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/enquiries">Enquiries</Nav.Link>
                            </Nav.Item>
                            {isLoggedIn && (
                                <Nav.Item>
                                    <Nav.Link onClick={logout} style={{ cursor: 'pointer' }}>
                                        Logout
                                    </Nav.Link>
                                </Nav.Item>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default TitleBar;
