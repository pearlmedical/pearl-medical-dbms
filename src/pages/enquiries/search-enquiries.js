// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { Table, Form, Modal, Button, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(new Date());
  const [closeEnquiry, setCloseEnquiry] = useState(false);
  const [forwardToSales, setForwardToSales] = useState(false);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState('');
  const [updateErrorMessage, setUpdateErrorMessage] = useState('');

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

        // Check if both enquiryDetails and furtherDetails are present
        if (data.enquiryDetails && data.furtherDetails && data.enquiryDetails.length > 0 && data.furtherDetails.length > 0) {
          // Combine the details for the selected enquiry
          const selectedEnquiryDetails = {
            enquiryDetails: data.enquiryDetails,
            furtherDetails: data.furtherDetails[0],
          };
console.log(selectedEnquiryDetails);
          setSelectedEnquiry(selectedEnquiryDetails);
          setShowModal(true);
        } else {
          console.error('Invalid API response:', data);
        }
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
    setCloseEnquiry(false);
    setForwardToSales(false);
    setUpdateSuccessMessage('');
    setUpdateErrorMessage('');
  };

  const handleUpdateEnquiry = async () => {
    if (!selectedEnquiry) {
      return;
    }

    const { enquiry_id, is_open } = selectedEnquiry.furtherDetails;

    try {
      const response = await fetch('/api/potentialCustomers/update-follow-up', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enquiry_id,
          follow_up_date: is_open ? followUpDate : null,
          is_open: closeEnquiry || forwardToSales ? false: true,
          closed_by: closeEnquiry ? 'Customer' : forwardToSales ? 'Sales' : null,
        }),
      });

      if (response.ok) {
        setUpdateSuccessMessage('Enquiry updated successfully.');
        setUpdateErrorMessage('');
        fetchAllEnquiries(); // Refresh the enquiries after update
      } else {
        const errorData = await response.json();
        setUpdateSuccessMessage('');
        setUpdateErrorMessage(`Error updating enquiry: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating enquiry:', error);
      setUpdateSuccessMessage('');
      setUpdateErrorMessage('Internal Server Error');
    }
  };

  const filteredEnquiries = enquiries?.filter(
    (enquiry) =>
      enquiry.enquiry_id.toString().includes(searchTerm) ||
      enquiry.remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.date_of_enquiry.toString().includes(searchTerm) ||
      enquiry.follow_up_date.toString().includes(searchTerm) ||
      enquiry.is_open.toString().includes(searchTerm) ||
      enquiry.potential_customers.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Search Enquiries</h2>
      <Form.Group controlId="searchForm">
        <Form.Control
          type="text"
          placeholder="Search by Enquiry ID, Remarks, Date of Enquiry, Follow_up_date, open/closed, or Customer Name"
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
              <th>Follow_up_Date</th>
              <th>Open/Closed</th>
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
                <td>{enquiry.follow_up_date}</td>
                <td>{enquiry.is_open ? 'Open' : 'Closed'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No records found in the table.</p>
      )}

      <EnquiryDetailsModal
        selectedEnquiry={selectedEnquiry}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        setFollowUpDate={setFollowUpDate}
        setCloseEnquiry={setCloseEnquiry}
        setForwardToSales={setForwardToSales}
        updateSuccessMessage={updateSuccessMessage}
        updateErrorMessage={updateErrorMessage}
        handleUpdateEnquiry={handleUpdateEnquiry}
        followUpDate={followUpDate} // Pass followUpDate as a prop
      />
    </div>
  );
};

const EnquiryDetailsModal = ({
  selectedEnquiry,
  showModal,
  handleCloseModal,
  setFollowUpDate,
  setCloseEnquiry,
  setForwardToSales,
  updateSuccessMessage,
  updateErrorMessage,
  handleUpdateEnquiry,
}) => {
  if (!selectedEnquiry) {
    return null;
  }

  const { enquiryDetails, furtherDetails } = selectedEnquiry;
  const { enquiry_id, potential_customers } = enquiryDetails[0];
  const { is_open ,follow_up_date} = furtherDetails;

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
            {enquiryDetails.map((enquiry, index) => (
              <tr key={index}>
                <td>{enquiry.quantity}</td>
                <td>{enquiry.products.product_id}</td>
                <td>{enquiry.products.product_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {is_open ? (
          <>
            <Form.Group controlId="followUpDate">
              <Form.Label>Follow-up Date</Form.Label>
              <div className="input-group">
           
              <DatePicker
                  selected={follow_up_date ? new Date(follow_up_date) : new Date()}
                  onChange={(date) => setFollowUpDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                  required
                />


              </div>
            </Form.Group>

            <Form.Group controlId="closeEnquiry">
              <Form.Check
                type="checkbox"
                label="Close Enquiry"
                onChange={(e) => setCloseEnquiry(e.target.checked)}
              />
            </Form.Group>

            <Form.Group controlId="forwardToSales">
              <Form.Check
                type="checkbox"
                label="Forward to Sales Team"
                onChange={(e) => setForwardToSales(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleUpdateEnquiry}>
              Update
            </Button>

            {updateSuccessMessage && (
              <Alert variant="success" className="mt-3">
                {updateSuccessMessage}
              </Alert>
            )}
            {updateErrorMessage && (
              <Alert variant="danger" className="mt-3">
                {updateErrorMessage}
              </Alert>
            )}
          </>
        ) : (
          <div style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
            Enquiry Closed
          </div>
        )}
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
