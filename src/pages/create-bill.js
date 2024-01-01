// pages/create-bill.js

import React,{ useState } from 'react';
import Layout from '@/components/Layout';
import { Form,Button,Row,Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateBill = () => {
    const [user_id,setUserId] = useState('');
    const [date_of_sale,setDateOfSale] = useState(new Date());
    const [remarks,setRemarks] = useState('');
    const [total_amount,setTotalAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:',{ user_id,date_of_sale,remarks,total_amount });
    };

    return (
        <div>
            <h2>Create Bill</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="user_id">
                            <Form.Label>User ID</Form.Label>
                            <Form.Control
                                type="number"
                                value={user_id}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter 6-digit User ID"
                                maxLength="6"
                                minLength="6"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="date_of_sale">
                            <Form.Label>Date of Sale</Form.Label>
                            <DatePicker
                                selected={date_of_sale}
                                onChange={(date) => setDateOfSale(date)}
                                dateFormat="MMMM d, yyyy"
                                className="form-control"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group controlId="remarks">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter remarks"
                    />
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="total_amount">
                            <Form.Label>Total Amount (INR)</Form.Label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">₹</span>
                                </div>
                                <Form.Control
                                    type="number"
                                    value={total_amount}
                                    onChange={(e) => setTotalAmount(e.target.value)}
                                    placeholder="Enter total amount"
                                    required
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default CreateBill;
