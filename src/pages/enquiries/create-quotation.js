import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Table, InputGroup, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateQuotation = () => {
  const [customer_id, setUserId] = useState('');
  const [date, setDateOfEnquiry] = useState(new Date());
  const [remarks, setRemarks] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleProductAction = (product, quantity = 1) => {
    const isProductSelected = selectedProducts.find((selected) => selected.product_id === product.product_id);
    const productWithPrice = { ...product, price: 0 };

    setSelectedProducts([...selectedProducts, { ...productWithPrice, quantity }]);
    
    if (isProductSelected) {
      const updatedSelectedProducts = selectedProducts.filter((selected) => selected.product_id !== product.product_id);
      setSelectedProducts(updatedSelectedProducts);
    }
  };

  const handleRowClick = (clickedProduct) => {
    const isProductSelected = selectedProducts.some((product) => product.product_id === clickedProduct.product_id);

    if (isProductSelected) {
      handleIncreaseQuantity(clickedProduct);
    } else {
      const productWithPrice = { ...clickedProduct, price: 0 };
      handleProductAction(productWithPrice, 1);
    }
  };

  const handlePriceChange = (index, event) => {
    const newSelectedProducts = [...selectedProducts];
    const newPrice = parseFloat(event.target.value);

    if (!isNaN(newPrice) && newPrice >= 0) {
      newSelectedProducts[index].price = newPrice;
      setSelectedProducts(newSelectedProducts);
    }
  };

  const handleIncreaseQuantity = (product) => {
    const updatedSelectedProducts = selectedProducts.map((selected) =>
      selected.product_id === product.product_id ? { ...selected, quantity: selected.quantity + 1 } : selected
    );
    setSelectedProducts(updatedSelectedProducts);
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch('/api/potentialCustomers/fetch-all-enquiries');
        if (response.ok) {
          const data = await response.json();
          setAllEnquiries(data);
        } else {
          console.error('Error fetching enquiries:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };

    fetchEnquiries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userIdRegex = /^\d{6}$/;
    if (!userIdRegex.test(customer_id)) {
      setSuccessMessage('');
      setErrorMessage('User ID must be exactly 6 digits.');
      return;
    }

    try {
      const response = await fetch('/api/potentialCustomers/add-quotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_id, date, enquiry_id }),
      });

      if (response.ok) {
        const data = await response.json();

        const postData = {
          customer_id: customer_id,
          enquiry_id: data.enquiry_id,
          products: selectedProducts,
        };

        try {
          const postResponse = await fetch('/api/potentialCustomers/add-interests-of-customer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          });

          if (postResponse.ok) {
            setTimeout(() => {
              setSuccessMessage(`Enquiry created successfully with ID: ${data.intrest_id}`);
            }, 3000);
          } else {
            const errorData = await postResponse.json();
            setErrorMessage(`Error: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Error:', error);
          setErrorMessage('Internal Server Error');
        }
      } else {
        const errorData = await response.json();
        setSuccessMessage('');
        setErrorMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating Enquiry:', error);
      setSuccessMessage('');
      setErrorMessage('Internal Server Error');
    }
  };

  const handleClearSelected = () => {
    setSelectedProducts([]);
  };

  const handleQuantityChange = (index, event) => {
    const newSelectedProducts = [...selectedProducts];
    const newQuantity = parseInt(event.target.value, 10);

    if (!isNaN(newQuantity) && newQuantity >= 0) {
      newSelectedProducts[index].quantity = newQuantity;
      setSelectedProducts(newSelectedProducts);
    }
  };

  const handleRemoveProduct = (product) => {
    const updatedSelectedProducts = selectedProducts.filter((selected) => selected.product_id !== product.product_id);
    setSelectedProducts(updatedSelectedProducts);
  };

  return (
    <div>
      <h2>Create Enquiry</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="customer_id">
              <Form.Label>Customer ID</Form.Label>
              <Form.Control
                type="number"
                value={customer_id}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter 6-digit User ID"
                maxLength="6"
                minLength="6"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="date">
              <Form.Label>Date </Form.Label>
              <div className="input-group">
                <DatePicker
                  selected={date}
                  onChange={(date) => setDateOfEnquiry(date)}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <h4>Selected Products</h4>
            <Table striped bordered hover style={{ maxHeight: '300px', minHeight: '300px', overflowY: 'auto', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Prod. ID</th>
                  <th style={{ width: '25%' }}>Prod. Name</th>
                  <th style={{ minWidth: '20%' }}>Quantity</th>
                  <th style={{ minWidth: '15%' }}>Price</th>
                  <th style={{ minWidth: '1%' }}></th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Table is empty
                    </td>
                  </tr>
                ) : (
                  selectedProducts.map((selectedProduct, index) => (
                    <tr key={selectedProduct.product_id}>
                      <td>{selectedProduct.product_id}</td>
                      <td>{selectedProduct.product_name}</td>
                      <td>
                        <FormControl
                          type="number"
                          step="1"
                          value={selectedProduct.quantity}
                          onChange={(e) => handleQuantityChange(index, e)}
                          style={{ fontSize: '0.8rem' }}
                        />
                      </td>
                      <td>
                        <FormControl
                          type="number"
                          step="0.01"
                          value={selectedProduct.price || 0}
                          onChange={(e) => handlePriceChange(index, e)}
                          style={{ fontSize: '0.8rem' }}
                        />
                      </td>
                      <td>
                        <Button
                          variant="light"
                          size="sm"
                          style={{ fontSize: '0.8rem', margin: '0', padding: '0' }}
                          onClick={() => handleRemoveProduct(selectedProduct)}
                        >
                          ❌
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <Button variant="danger" onClick={handleClearSelected}>
              Clear Selected
            </Button>
          </Col>

          <Col md={6}>
            <h4>All Enquiries</h4>
            <Table striped bordered hover style={{ maxHeight: '250px', minHeight: '250px', overflowY: 'auto', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Enquiry ID</th>
                  <th>Remarks</th>
                  <th>Date of Enquiry</th>
                  <th>Customer Name</th>
                  <th>Customer ID</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {allEnquiries
                  .map((enquiry) => (
                    <tr
                      key={enquiry.enquiry_id}
                      onClick={() => {
                        handleRowClick(enquiry);
                      }}
                    >
                      <td>{enquiry.enquiry_id}</td>
                      <td>{enquiry.remarks}</td>
                      <td>{enquiry.date_of_enquiry}</td>
                      <td>{enquiry.potential_customers.name}</td>
                      <td>{enquiry.potential_customers.customer_id}</td>
                      <td>{enquiry.potential_customers.phone_number}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col md={9}>
            <Form.Group controlId="remarks">
              <Form.Label>Additional Remarks</Form.Label>
              <Form.Control as="textarea" rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter remarks" style={{ resize: 'none' }} />
            </Form.Group>
          </Col>
        </Row>

        <p></p>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default CreateQuotation;
