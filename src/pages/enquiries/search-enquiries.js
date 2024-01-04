import React, { useState, useEffect } from 'react';
import { Table, Form, Modal, Button } from 'react-bootstrap';

const SearchEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch enquiries from the API
  const fetchAllEnquiries = async () => {
    try {
      const response = await fetch('/api/potentialCustomers/fetch-all-enquiries');
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data);
      } else {
        console.error('Error fetching enquiries:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  useEffect(() => {
    fetchAllEnquiries();
  }, []);

  const handleRowDoubleClick = async (enquiryId) => {
    try {
      const response = await fetch(`/api/potentialCustomers/fetch-enquiry-details?enquiryId=${enquiryId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedEnquiry(data);
        setShowModal(true);
      } else {
        console.error('Error fetching enquiry details:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching enquiry details:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEnquiry(null);
  };

  const filteredEnquiries = enquiries?.filter(
    (enquiry) =>
      enquiry.enquiry_id.toString().includes(searchTerm) ||
      enquiry.remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.date_of_enquiry.toString().includes(searchTerm) ||
      enquiry.potential_customers.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Search Enquiries</h2>
      <Form.Group controlId="searchForm">
        <Form.Control
          type="text"
          placeholder="Search by Enquiry ID, Remarks, Date of Enquiry, or Customer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <hr />
      {filteredEnquiries.length > 0 ? (
        <Table striped bordered hover>
        <thead>
            <tr>
              <th>Enquiry ID</th>
              <th>Remarks</th>
              <th>Date of Enquiry</th>
              <th>Customer Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries?.map((enquiry, index) => (
              <tr
                key={enquiry.enquiry_id}
                style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}
                onDoubleClick={() => handleRowDoubleClick(enquiry.enquiry_id)}
              >
                <td>{enquiry.enquiry_id}</td>
                <td>{enquiry.remarks}</td>
                <td>{enquiry.date_of_enquiry}</td>
                <td>{enquiry.potential_customers.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No records found in the table.</p>
      )}

      {/* Modal to display enquiry details */}
      <EnquiryDetailsModal
        selectedEnquiry={selectedEnquiry}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
      />

    </div>
  );
};

const EnquiryDetailsModal = ({ selectedEnquiry,showModal,handleCloseModal }) => {
  if (!selectedEnquiry || selectedEnquiry.length === 0) {
    return null;
  }

  const { enquiry_id,potential_customers } = selectedEnquiry[0];

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Enquiry Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Enquiry ID: {enquiry_id}</p>
        <p>Customer ID: {potential_customers.customer_id}</p>
        <p>Customer Name: {potential_customers.name}</p>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Product ID</th>
              <th>Product Name</th>
            </tr>
          </thead>
          <tbody>
            {selectedEnquiry.map((enquiry,index) => (
              <tr key={index}>
                <td>{enquiry.quantity}</td>
                <td>{enquiry.products.product_id}</td>
                <td>{enquiry.products.product_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
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
