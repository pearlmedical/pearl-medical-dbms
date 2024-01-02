// Sidebar.js

import React from 'react';
import { Navbar,Nav } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
    const router = useRouter();

    return (
        <div style={{ width: '13%',height: '100vh',top: 0,left: 0,overflowY: 'auto' }}>
            <Navbar bg="light" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" className="flex-column" activeKey={router.pathname}>
                        <Nav.Link href="/search-product">Search Product</Nav.Link>
                        <Nav.Link href="/edit-product">Edit Product</Nav.Link>
                        <Nav.Link href="/delete-product">Delete Product</Nav.Link>
                        <Nav.Link href="/add-product">Add Product</Nav.Link>
                        <Nav.Link href="/create-bill">Create Bill</Nav.Link>
                        <Nav.Link href="/createUser">Create User</Nav.Link>
                        <Nav.Link href="/search-user">Search User</Nav.Link>
                        <Nav.Link href="/edit-user-details">Edit User Details</Nav.Link>
                        <Nav.Link href="/search-bill">Search Bill</Nav.Link>
                        <Nav.Link href="/product-customer">Product-Customer</Nav.Link>
                        <Nav.Link href="/bill-customer">Bill-Customer</Nav.Link>

                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default Sidebar;
