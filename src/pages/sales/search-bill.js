// pages/search-bills.js
import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';

const SearchBills = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedField, setSortedField] = useState('bill_id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch bills from the API
  const fetchAllBills = async () => {
    try {
      const response = await fetch('api/fetchAllBills');
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  useEffect(() => {
    fetchAllBills();
  }, []);

  const handleSort = (field) => {
    setSortedField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredBills = bills?.filter(
    (bill) =>
      bill.bill_id.toString().includes(searchTerm) ||
      bill.user_id.toString().includes(searchTerm) ||
      bill.user_name.toLowerCase().includes(searchTerm.toLowerCase()) || // Include user_name in search
      bill.date_of_sale.toString().includes(searchTerm) ||
      bill.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Search Bills</h2>
      <Form.Group controlId="searchForm">
        <Form.Control
          type="text"
          placeholder="Search by Bill ID, User ID, User Name, Date of Sale, or Remarks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <hr />
      {filteredBills.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort('bill_id')}>Bill ID</th>
              <th onClick={() => handleSort('user_id')}>User ID</th>
              <th onClick={() => handleSort('user_name')}>User Name</th>
              <th onClick={() => handleSort('date_of_sale')}>Date of Sale</th>
              <th onClick={() => handleSort('remarks')}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills?.map((bill, index) => (
              <tr key={bill.bill_id} style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}>
                <td>{bill.bill_id}</td>
                <td>{bill.user_id}</td>
                <td>{bill.user_name}</td>
                <td>{bill.date_of_sale}</td>
                <td>{bill.remarks}</td>
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

export default SearchBills;
