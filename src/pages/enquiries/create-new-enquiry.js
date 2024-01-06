// pages/create-enquiry.js

import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Table, InputGroup, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateEnquiry = () => {
  const [customer_id, setUserId] = useState('');
  const [date_of_enquiry, setDateOfEnquiry] = useState(new Date());
  const [followUpDate, setFollowUpDate] = useState(new Date());
  const [remarks, setRemarks] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/sales/fetchAllProducts');
        if (response.ok) {
          const data = await response.json();
          setAllProducts(data);
        } else {
          console.error('Error fetching products:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductAction = (product, quantity = 1) => {
    const isProductSelected = selectedProducts.find((selected) => selected.product_id === product.product_id);

    setSelectedProducts([...selectedProducts, { ...product, quantity }]);

    if (isProductSelected) {
      const updatedSelectedProducts = selectedProducts.filter((selected) => selected.product_id !== product.product_id);
      setSelectedProducts(updatedSelectedProducts);
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity }]);
    }
  };

  const handleClearSelected = () => {
    setSelectedProducts([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userIdRegex = /^\d{6}$/;
    if (!userIdRegex.test(customer_id)) {
      setSuccessMessage('');
      setErrorMessage('User ID must be exactly 6 digits.');
      return;
    }

    try {
      const response = await fetch('/api/potentialCustomers/add-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_id, date_of_enquiry, follow_up_date: followUpDate, remarks }),
      });

      if (response.ok) {
        const data = await response.json();

        const postData = {
          customer_id: customer_id,
          enquiry_id: data.enquiry_id,
          products: selectedProducts,
          follow_up_date: followUpDate,
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
              setSuccessMessage(`Enquiry created successfully with ID: ${data.enquiry_id}`);
            }, 3000);
          } else {
            const errorData = await postResponse.json();
          }
        } catch (error) {
          console.error('Error:', error);
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

  const handleIncreaseQuantity = (product) => {
    const updatedSelectedProducts = selectedProducts.map((selected) =>
      selected.product_id === product.product_id ? { ...selected, quantity: selected.quantity + 1 } : selected
    );
    setSelectedProducts(updatedSelectedProducts);
  };

  const handleDecreaseQuantity = (product) => {
    const updatedSelectedProducts = selectedProducts.map((selected) =>
      selected.product_id === product.product_id && selected.quantity > 0
        ? { ...selected, quantity: selected.quantity - 1 }
        : selected
    );
    setSelectedProducts(updatedSelectedProducts);
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

  const handleRowClick = (clickedProduct) => {
    const isProductSelected = selectedProducts.some((product) => product.product_id === clickedProduct.product_id);

    if (isProductSelected) {
      handleIncreaseQuantity(clickedProduct);
    } else {
      handleProductAction(clickedProduct, 1);
    }
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
            <Form.Group controlId="date_of_enquiry">
              <Form.Label>Date of Enquiry</Form.Label>
              <div className="input-group">
                <DatePicker
                  selected={date_of_enquiry}
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
            <Form.Group controlId="follow_up_date">
              <Form.Label>Follow-up Date</Form.Label>
              <div className="input-group">
                <DatePicker
                  selected={followUpDate}
                  onChange={(date) => setFollowUpDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
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
                  <th style={{ minWidth: '1%' }}></th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
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
            <h4>All Products</h4>
            <InputGroup className="mb-3">
              <FormControl placeholder="Search by Product ID or Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </InputGroup>
            <Table striped bordered hover style={{ maxHeight: '250px', minHeight: '250px', overflowY: 'auto', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {allProducts
                  .filter((product) => product.product_id.toString().includes(searchTerm) || product.product_name.includes(searchTerm))
                  .map((product) => (
                    <tr
                      key={product.product_id}
                      onClick={() => handleRowClick(product)}
                    >
                      <td>{product.product_id}</td>
                      <td>{product.product_name}</td>
                      <td>{product.quantity || 0}</td>
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

export default CreateEnquiry;
