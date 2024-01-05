// pages/edit-employee.js

import React, { useState, useEffect } from 'react';
import { Table, Form, Modal, Button } from 'react-bootstrap';

const EditEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedField, setSortedField] = useState('employee_id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch employees from the API or your database here
    const fetchData = async () => {
      try {
        const response = await fetch('/api/employee/fetch-all-employees');
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        } else {
          console.error('Error fetching employees:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field) => {
    setSortedField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDoubleClick = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleUpdate = async (updatedEmployee) => {
    try {
      const response = await fetch('/api/employee/update-employee-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedEmployees = employees.map((employee) => (employee.employee_id === data.employee_id ? data : employee));
        setEmployees(updatedEmployees);
        setEditingEmployee(null);
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error('Error updating employee:', errorData);
        // Handle error scenarios as needed
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      // Handle error scenarios as needed
    }
  };

  const handleCloseModal = () => {
    setEditingEmployee(null);
    setShowModal(false);
  };

  return (
    <div>
      <h2>Edit Employee Details</h2>
      <Form.Group controlId="searchForm">
        <Form.Control
          type="text"
          placeholder="Search by Employee ID, Name, Phone Number, or Email ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('employee_id')}>Employee ID</th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('address')}>Address</th>
            <th onClick={() => handleSort('phone_number')}>Phone Number</th>
            <th onClick={() => handleSort('email_id')}>Email ID</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr
              key={employee.employee_id}
              style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}
              onDoubleClick={() => handleDoubleClick(employee)}
            >
              <td>{employee.employee_id}</td>
              <td>{employee.name}</td>
              <td>{employee.address}</td>
              <td>{employee.phone_number}</td>
              <td>{employee.email_id}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Editing Employee Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={editingEmployee?.name || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={editingEmployee?.address || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, address: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={editingEmployee?.phone_number || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, phone_number: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email ID</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email ID"
                value={editingEmployee?.email_id || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, email_id: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEmployeeId">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee ID"
                value={editingEmployee?.employee_id || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, employee_id: e.target.value })}
                disabled
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleUpdate(editingEmployee)}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditEmployee;
