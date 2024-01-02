import React,{ useState } from 'react';
import { Form,Button,Alert,Row,Col } from 'react-bootstrap';

const AddProduct = () => {
    const [productName,setProductName] = useState('');
    const [cost,setCost] = useState(0);
    const [remarks,setRemarks] = useState('');
    const [quantity,setQuantity] = useState(0);
    const [successMessage,setSuccessMessage] = useState('');
    const [errorMessage,setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/sales/addProduct',{
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
            console.error('Error adding product:',error);
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
                <Row>
                    <Col>
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
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="remarks">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control
                                type="text"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter remarks"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default AddProduct;