// pages/add-product.js
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [cost, setCost] = useState('');
    const [remarks, setRemarks] = useState('');
    const [quantity, setQuantity] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_name: productName,
                    cost,
                    remarks,
                    quantity,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage(`Product added successfully with ID: ${data.product_id}`);
                setErrorMessage('');
            } else {
                const errorData = await response.json();
                setSuccessMessage('');
                setErrorMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setSuccessMessage('');
            setErrorMessage('Internal Server Error');
        }
    };

    return (
        <div>
            <h2>Add Product</h2>

            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="productName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name"
                        required
                    />
                </Form.Group>
                <Form.Group controlId="cost">
                    <Form.Label>Cost</Form.Label>
                    <Form.Control
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="Enter cost"
                        required
                    />
                </Form.Group>
                <Form.Group controlId="remarks">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                        type="text"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter remarks"
                    />
                </Form.Group>
                <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default AddProduct;
