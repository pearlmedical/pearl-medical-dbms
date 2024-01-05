// Sidebar.js

import React from 'react';
import { Navbar,Nav } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
    const router = useRouter();
    const currentRoute = router.pathname;

    return (
        <div style={{ maxWidth: '15%',height: '100vh',top: 0,left: 0,overflowY: 'auto' }}>
            <Navbar bg="light" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        variant="pills"
                        className="flex-column"
                        activeKey={router.pathname}
                        style={{ fontSize: '1rem',gap: '0' }} // Adjust the font size and margin-top as needed
                    >
                        {currentRoute.includes('sales') && (
                            <>
                                <Nav.Link href="/sales/search-product">Search Product</Nav.Link>
                                <Nav.Link href="/sales/edit-product">Edit Product</Nav.Link>
                                <Nav.Link href="/sales/delete-product">Delete Product</Nav.Link>
                                <Nav.Link href="/sales/add-product">Add Product</Nav.Link>

                                <Nav.Link href="/sales/create-user">Create User</Nav.Link>
                                <Nav.Link href="/sales/search-user">Search User</Nav.Link>
                                <Nav.Link href="/sales/edit-user-details">Edit User Details</Nav.Link>

                                <Nav.Link href="/sales/create-bill">Create Bill</Nav.Link>
                                <Nav.Link href="/sales/search-bill">Search Bill</Nav.Link>
                                <Nav.Link href="/sales/search-user-by-product">Search User By Product</Nav.Link>
                                <Nav.Link href="/sales/search-product-by-user">Search Product By User</Nav.Link>
                                <Nav.Link href="/sales/search-bill-by-user">Search Bill By User</Nav.Link>
                            </>
                        )}

                        {currentRoute.includes('enquiries') && (
                            <>
                                <Nav.Link href="/enquiries/create-new-customer">Create New Customer</Nav.Link>
                                <Nav.Link href="/enquiries/create-new-enquiry">Create New Enquiry</Nav.Link>
                                <Nav.Link href="/enquiries/search-interests">Search Interests</Nav.Link>
                                <Nav.Link href="/enquiries/search-enquiries">Search Enquiries</Nav.Link>
                                <Nav.Link href="/enquiries/create-quotation">Create Quotation</Nav.Link>
                            </>
                        )}

                        {currentRoute.includes('admin') && (
                            <>
                                <Nav.Link href="/admin/create-new-employee">Create New Employee</Nav.Link>
                                <Nav.Link href="/admin/update-employee-details">Update Employee Details</Nav.Link>
                                <Nav.Link href="/admin/update-employee-access">Update Employee Access</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default Sidebar;
