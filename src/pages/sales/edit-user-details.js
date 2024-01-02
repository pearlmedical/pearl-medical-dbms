// pages/search-user.js

import React, { useState, useEffect } from 'react';
import { Table, Form, Modal, Button } from 'react-bootstrap';

const EditUser = () => {
    const [users, setUsers] = useState([
        { user_id: 1, name: 'User 1', address: 'Address 1', organization_name: 'Org 1', phone_number: '1234567890', email_id: 'user1@example.com' }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedField, setSortedField] = useState('user_id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Fetch users from the API or your database here
        const fetchData = async () => {
          const response = await fetch('api/sales/fetchExistingUser');
          const data = await response.json();
          setUsers(data);
        };
        fetchData();
    }, []);

    const handleSort = (field) => {
        setSortedField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleDoubleClick = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleUpdate = async (updatedUser) => {
        try {
          const response = await fetch('/api/sales/editUserDetails', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
          });
    
          if (response.ok) {
            const data = await response.json();
            const updatedUsers = users.map((user) => (user.user_id === data.user_id ? data : user));
            setUsers(updatedUsers);
            setEditingUser(null);
            setShowModal(false);
          } else {
            const errorData = await response.json();
            console.error('Error updating user:', errorData);
            // Handle error scenarios as needed
          }
        } catch (error) {
          console.error('Error updating user:', error);
          // Handle error scenarios as needed
        }
      };

    const handleCloseModal = () => {
        setEditingUser(null);
        setShowModal(false);
    };

    return (
        <div>
            <h2>Edit User Details</h2>
            <Form.Group controlId="searchForm">
            <Form.Control
                    type="text"
                    placeholder="Search by User ID, Name, Organization, Phone Number, or Email ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form.Group>
            <hr />
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
                    {users.map((user, index) => (
                        <tr
                            key={user.user_id}
                            style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}
                            onDoubleClick={() => handleDoubleClick(user)}
                        >
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

            {/* Modal for Editing User Details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={editingUser?.name || ''}
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter address"
                                value={editingUser?.address || ''}
                                onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formOrganization">
                            <Form.Label>Organization</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter organization"
                                value={editingUser?.organization_name || ''}
                                onChange={(e) => setEditingUser({ ...editingUser, organization_name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter phone number"
                                value={editingUser?.phone_number || ''}
                                onChange={(e) => setEditingUser({ ...editingUser, phone_number: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email ID</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email ID"
                                value={editingUser?.email_id || ''}
                                onChange={(e) => setEditingUser({ ...editingUser, email_id: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleUpdate(editingUser)}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EditUser;
