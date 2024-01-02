// pages/create-user.js
import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

const CreateUser = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailId, setEmailId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    address,
                    organization_name: organizationName,
                    phone_number: phoneNumber,
                    email_id: emailId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage(`User created successfully with ID: ${data.id}`);
                setErrorMessage('');
            } else {
                const errorData = await response.json();
                setSuccessMessage('');
                setErrorMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setSuccessMessage('');
            setErrorMessage('Internal Server Error');
        }
    };

    return (
        <div>
            <h2>Create User</h2>

            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter name"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="organizationName">
                            <Form.Label>Organization Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                placeholder="Enter organization name"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="phoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter phone number"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="emailId">
                            <Form.Label>Email ID</Form.Label>
                            <Form.Control
                                type="email"
                                value={emailId}
                                onChange={(e) => setEmailId(e.target.value)}
                                placeholder="Enter email ID"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <div className="sp" >
                    
                </div>
                <div className="mb-3">
                  
                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Submit
                </Button>
             
                </div>
            </Form>
        </div>
    );
};

export default CreateUser;
