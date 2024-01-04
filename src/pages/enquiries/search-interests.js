// pages/search-interests.js
import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';

const SearchInterests = () => {
  const [interests, setInterests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedField, setSortedField] = useState('intrest_id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch interests from the API
  const fetchAllInterests = async () => {
    try {
      const response = await fetch('/api/potentialCustomers/fetch-all-interests'); // Update the API endpoint
      const data = await response.json();
      setInterests(data);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  useEffect(() => {
    fetchAllInterests();
  }, []);

  const handleSort = (field) => {
    setSortedField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredInterests = interests?.filter(
    (interest) =>
      interest.intrest_id.toString().includes(searchTerm) ||
      interest.product_id.toString().includes(searchTerm) ||
      interest.products.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interest.potential_customers.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interest.potential_customers.phone_number.includes(searchTerm)
  );

  return (
    <div>
      <h2>Search Interests</h2>
      <Form.Group controlId="searchForm">
        <Form.Control
          type="text"
          placeholder="Search by Interest ID, Product ID, Product Name, Customer Name, or Phone Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <hr />
      {filteredInterests.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort('intrest_id')}>Interest ID</th>
              <th onClick={() => handleSort('product_id')}>Product ID</th>
              <th onClick={() => handleSort('product_name')}>Product Name</th>
              <th onClick={() => handleSort('customer_name')}>Customer Name</th>
              <th onClick={() => handleSort('phone_number')}>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterests?.map((interest, index) => (
              <tr key={interest.intrest_id} style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}>
                <td>{interest.intrest_id}</td>
                <td>{interest.product_id}</td>
                <td>{interest.products.product_name}</td>
                <td>{interest.potential_customers.name}</td>
                <td>{interest.potential_customers.phone_number}</td>
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

export default SearchInterests;
