// Sidebar.js

import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
    const router = useRouter();
    const currentRoute = router.pathname;
    // const { employeeID } = useAuth();
    // const [employeeAccess,setEmployeeAccess] = useState([]);
    const { accessLevels } = useAuth();

    // useEffect(() => {
    //     const fetchEmployeeAccess = async () => {
    //         try {
    //             const response = await fetch(`/api/employee/fetch-access-level-of-employee?employee_id=${employeeID}`);
    //             const data = await response.json();
    //             console.log('Employee access levels:', data.access_allowed);
    //             setEmployeeAccess(data.access_allowed || []);
    //         } catch (error) {
    //             console.error('Error fetching employee access levels:', error);
    //         }
    //     };

    //     if (employeeID) {
    //         fetchEmployeeAccess();
    //     }
    // }, [employeeID]);

    // const renderTab = (href, label) => (
    //     <Nav.Link href={href} key={href}>
    //         {label}
    //     </Nav.Link>
    // );



    const salesTabs = [
        { href: '/sales/search-product', label: 'Search Product', accessLevel: 'search-product' },
        { href: '/sales/edit-product', label: 'Edit Product', accessLevel: 'edit-product' },
        { href: '/sales/delete-product', label: 'Delete Product', accessLevel: 'delete-product' },
        { href: '/sales/add-product', label: 'Add Product', accessLevel: 'add-product' },
        { href: '/sales/create-user', label: 'Create User', accessLevel: 'create-user' },
        { href: '/sales/search-user', label: 'Search User', accessLevel: 'search-user' },
        { href: '/sales/edit-user-details', label: 'Edit User Details', accessLevel: 'edit-user-details' },
        { href: '/sales/create-bill', label: 'Create Bill', accessLevel: 'create-bill' },
        { href: '/sales/search-bill', label: 'Search Bill', accessLevel: 'search-bill' },
        { href: '/sales/search-user-by-product', label: 'Search User By Product', accessLevel: 'search-user-by-product' },
        { href: '/sales/search-product-by-user', label: 'Search Product By User', accessLevel: 'search-product-by-user' },
        { href: '/sales/search-bill-by-userid', label: 'Search Bill By User', accessLevel: 'search-bill-by-user' },
    ];

    const enquiriesTabs = [
        { href: '/enquiries/create-new-customer', label: 'Create New Customer', accessLevel: 'create-new-customer' },
        { href: '/enquiries/create-new-enquiry', label: 'Create New Enquiry', accessLevel: 'create-new-enquiry' },
        { href: '/enquiries/search-interests', label: 'Search Interests', accessLevel: 'search-interests' },
        { href: '/enquiries/search-enquiries', label: 'Search Enquiries', accessLevel: 'search-enquiries' },
        { href: '/enquiries/create-quotation', label: 'Create Quotation', accessLevel: 'create-quotation' },
    ];

    const adminTabs = [
        { href: '/admin/create-new-employee', label: 'Create New Employee', accessLevel: 'admin' },
        { href: '/admin/update-employee-details', label: 'Update Employee Details', accessLevel: 'admin' },
        { href: '/admin/update-employee-access', label: 'Update Employee Access', accessLevel: 'admin' },
    ];

    const allTabs = [...salesTabs, ...enquiriesTabs, ...adminTabs];

    return (
        <div style={{ maxWidth: '15%', height: '100vh', top: 0, left: 0, overflowY: 'auto' }}>
            <Navbar bg="light" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        variant="pills"
                        className="flex-column"
                        activeKey={router.pathname}
                        style={{ fontSize: '1rem', gap: '0' }}
                    >
                        {currentRoute.includes('sales') && salesTabs.map(({ href, label, accessLevel }) =>
                            accessLevels.includes(accessLevel) || accessLevels.includes('admin') ? (
                                <Nav.Link href={href} key={href}>
                                    {label}
                                </Nav.Link>
                            ) : null
                        )}

                        {currentRoute.includes('enquiries') && enquiriesTabs.map(({ href, label, accessLevel }) =>
                            accessLevels.includes(accessLevel) || accessLevels.includes('admin') ? (
                                <Nav.Link href={href} key={href}>
                                    {label}
                                </Nav.Link>
                            ) : null
                        )}

                        {currentRoute.includes('admin') && adminTabs.map(({ href, label, accessLevel }) =>
                            accessLevels.includes(accessLevel) || accessLevels.includes('admin') ? (
                                <Nav.Link href={href} key={href}>
                                    {label}
                                </Nav.Link>
                            ) : null
                        )}

                        {!currentRoute.includes('sales') && !currentRoute.includes('enquiries') && !currentRoute.includes('admin') && allTabs.map(({ href, label, accessLevel }) =>
                            accessLevels.includes(accessLevel) || accessLevels.includes('admin') ? (
                                <Nav.Link href={href} key={href}>
                                    {label}
                                </Nav.Link>
                            ) : null
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default Sidebar;
