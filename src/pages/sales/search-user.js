// pages/search-user.js

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Table, Form } from 'react-bootstrap';

const SearchUser = () => {
    const [users, setUsers] = useState([
        { user_id: 1, name: 'User 1', address: 'Address 1', organization_name: 'Org 1', phone_number: '1234567890', email_id: 'user1@example.com' }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedField, setSortedField] = useState('user_id');
    const [sortOrder, setSortOrder] = useState('asc');

    // Dummy API response (replace this with your actual API call)
    const fetchAllUsers = async () => {
        try {
            // Your actual API call to fetch users
            const response = await fetch('api/fetchExistingUser');
            const data = await response.json();
            console.log(data);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const handleSort = (field) => {
        setSortedField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filteredUsers = users?.filter(
        (user) =>
            user.user_id.toString().includes(searchTerm) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone_number.includes(searchTerm) ||
            user.email_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Search User</h2>
            <Form.Group controlId="searchForm">
                <Form.Control
                    type="text"
                    placeholder="Search by User ID, Name, Organization, Phone Number, or Email ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form.Group>
            <hr />
            {filteredUsers.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('user_id')}>User ID</th>
                            <th onClick={() => handleSort('name')}>Name</th>
                            <th onClick={() => handleSort('address')}>Address</th>
                            <th onClick={() => handleSort('organization_name')}>Organization</th>
                            <th onClick={() => handleSort('phone_number')}>Phone Number</th>
                            <th onClick={() => handleSort('email_id')}>Email ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers?.map((user, index) => (
                            <tr key={user.user_id} style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}>
                                <td>{user.user_id}</td>
                                <td>{user.name}</td>
                                <td>{user.address}</td>
                                <td>{user.organization_name}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.email_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No records found in the table.</p>
            )}
        </div>
    );
};

export default SearchUser;
