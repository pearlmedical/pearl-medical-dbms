import React, { useState, useEffect } from 'react';
import { Table, Form, Modal, Button } from 'react-bootstrap';

const SearchEnquiries = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch customers from the API
  const fetchAllCustomers = async () => {
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

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const handleRowDoubleClick = async (customerId) => {
    try {
      const response = await fetch(`/api/getCustomerDetails?customerId=${customerId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedCustomer(data);
        setShowModal(true);
      } else {
        console.error('Error fetching customer details:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.customer_id.toString().includes(searchTerm) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone_number.includes(searchTerm) ||
      customer.email_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Search Customers</h2>
      <Form.Group controlId="searchForm">
        <Form.Control
          type="text"
          placeholder="Search by Customer ID, Name, Phone Number, or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <hr />
      {filteredCustomers.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers?.map((customer, index) => (
              <tr
                key={customer.customer_id}
                style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}
                onDoubleClick={() => handleRowDoubleClick(customer.customer_id)}
              >
                <td>{customer.customer_id}</td>
                <td>{customer.name}</td>
                <td>{customer.phone_number}</td>
                <td>{customer.email_id}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No records found in the table.</p>
      )}

      {/* Modal to display customer details */}
      <CustomerDetailsModal
        selectedCustomer={selectedCustomer}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

const CustomerDetailsModal = ({ selectedCustomer, showModal, handleCloseModal }) => {
  if (!selectedCustomer || selectedCustomer.length === 0) {
    return null;
  }

  const { customer_id, name, phone_number, email_id, address, organisation_name } = selectedCustomer[0];

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Customer Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Customer ID: {customer_id}</p>
        <p>Name: {name}</p>
        <p>Phone Number: {phone_number}</p>
        <p>Email: {email_id}</p>
        <p>Address: {address}</p>
        <p>Organisation Name: {organisation_name}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchEnquiries;
