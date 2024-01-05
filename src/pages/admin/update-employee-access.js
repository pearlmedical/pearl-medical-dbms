// pages/search-employees.js
import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';

const SearchEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedField, setSortedField] = useState('employee_id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch employees from the API
  const fetchAllEmployees = async () => {
    try {
      const response = await fetch('/api/employee/fetch-all-employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const handleSort = (field) => {
    setSortedField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredEmployees = employees?.filter(
    (employee) =>
      employee.employee_id.toString().includes(searchTerm) ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone_number.toString().includes(searchTerm) ||
      employee.email_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Search Employees</h2>
      <Form.Group controlId="searchForm">
        <Form.Control
          type="text"
          placeholder="Search by Employee ID, Name, Phone Number, or Email ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <hr />
      {filteredEmployees.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort('employee_id')}>Employee ID</th>
              <th onClick={() => handleSort('name')}>Name</th>
              <th onClick={() => handleSort('phone_number')}>Phone Number</th>
              <th onClick={() => handleSort('email_id')}>Email ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees?.map((employee, index) => (
              <tr key={employee.employee_id} style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}>
                <td>{employee.employee_id}</td>
                <td>{employee.name}</td>
                <td>{employee.phone_number}</td>
                <td>{employee.email_id}</td>
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

export default SearchEmployees;
