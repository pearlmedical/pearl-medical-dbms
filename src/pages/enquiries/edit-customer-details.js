// pages/edit-customer.js

import React, { useState, useEffect } from 'react';
import { Table, Form, Modal, Button } from 'react-bootstrap';

const EditCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedField, setSortedField] = useState('customer_id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/potentialCustomers/fetch-all-customers');
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        } else {
          console.error('Error fetching customers:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field) => {
    setSortedField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDoubleClick = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleUpdate = async (updatedCustomer) => {
    try {
      const response = await fetch('/api/potentialCustomers/update-customer-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
      });
  
      if (response.ok) {
        const data = await response.json();
        const updatedCustomers = customers.map((customer) =>
          customer.customer_id === data.customer_id ? data : customer
        );
        setCustomers(updatedCustomers);
        setEditingCustomer(null);
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error('Error updating customer:', errorData);
        // Handle error scenarios as needed
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      // Handle error scenarios as needed
    }
  };
  

  const handleCloseModal = () => {
    setEditingCustomer(null);
    setShowModal(false);
  };

  return (
    <div>
      <h2>Edit Customer Details</h2>
      <Form.Group controlId="searchForm">
        <Form.Control
          type="text"
          placeholder="Search by Customer ID, Name, Phone Number, or Email ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('customer_id')}>Customer ID</th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('address')}>Address</th>
            <th onClick={() => handleSort('organisation_name')}>Organization</th>
            <th onClick={() => handleSort('phone_number')}>Phone Number</th>
            <th onClick={() => handleSort('email_id')}>Email ID</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr
              key={customer.customer_id}
              style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}
              onDoubleClick={() => handleDoubleClick(customer)}
            >
              <td>{customer.customer_id}</td>
              <td>{customer.name}</td>
              <td>{customer.address}</td>
              <td>{customer.organisation_name}</td>
              <td>{customer.phone_number}</td>
              <td>{customer.email_id}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Editing Customer Details */}
      <CustomerDetailsModal
        editingCustomer={editingCustomer}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

const CustomerDetailsModal = ({ editingCustomer, showModal, handleCloseModal, handleUpdate }) => {
  if (!editingCustomer) {
    return null;
  }

  const {
    customer_id,
    name,
    address,
    organisation_name,
    phone_number,
    email_id,
  } = editingCustomer;

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Customer Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name || ''}
              onChange={(e) => handleUpdate({ ...editingCustomer, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={address || ''}
              onChange={(e) => handleUpdate({ ...editingCustomer, address: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formOrganization">
            <Form.Label>Organization</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter organization"
              value={organisation_name || ''}
              onChange={(e) => handleUpdate({ ...editingCustomer, organisation_name: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={phone_number || ''}
              onChange={(e) => handleUpdate({ ...editingCustomer, phone_number: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email ID</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email ID"
              value={email_id || ''}
              onChange={(e) => handleUpdate({ ...editingCustomer, email_id: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleUpdate(editingCustomer)}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCustomer;
