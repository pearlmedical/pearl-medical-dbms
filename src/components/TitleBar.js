// components/TitleBar.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useEffect,useState } from 'react';

const TitleBar = () => {
    const { logout } = useAuth();
    const { employeeID } = useAuth();
    const [employeeAccess,setEmployeeAccess] = useState([]);

    useEffect(() => {
        const fetchEmployeeAccess = async () => {
            try {
                const response = await fetch(`/api/employee/fetch-access-level-of-employee?employee_id=${employeeID}`);
                const data = await response.json();
                console.log('Employee access levels:',data.access_allowed);
                setEmployeeAccess(data.access_allowed || []);
            } catch (error) {
                console.error('Error fetching employee access levels:',error);
            }
        };

        if (employeeID) {
            fetchEmployeeAccess();
        }
    },[employeeID]);

    return (
        <>
            <Navbar bg="primary" data-bs-theme="dark">
                {/* <Container> */}
                <Navbar.Brand href="/">
                    <div style={{ display: 'flex',alignItems: 'flex-start',color: 'white',padding: '0rem 2rem',textAlign: 'center' }}>
                        
                        <Image
                            alt=""
                            src="/Graphic2.png"
                            width={100}
                            height={40}
                            style={{objectFit: 'cover'}}
                            className="d-inline-block align-top"
                            priority
                        />
                        {/* <h1 style={{ marginLeft: '1rem' }}>Pearl Medical</h1> */}
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
                        {employeeAccess.includes('admin') && (
                            <Nav.Item>
                                <Nav.Link href="/admin">Admin</Nav.Link>
                            </Nav.Item>
                        )}
                        <Nav.Item>
                            <Nav.Link onClick={logout} style={{ cursor: 'pointer' }}>
                                Logout
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
                {/* </Container> */}
            </Navbar>
        </>
    );
};

export default TitleBar;
