import React from 'react';
import { Alert, Button } from 'react-bootstrap';

const AccessBlocked = () => {
    const goToHomePage = () => {
        // Redirect to the homepage
        window.location.href = '/';
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Alert variant="danger" style={{ width: '50%', textAlign: 'center' }}>
                <Alert.Heading>Access Denied</Alert.Heading>
                <p>You do not have the required access to view this page.</p>
                {/* You can add additional content or customization here */}
                <Button variant="primary" onClick={goToHomePage}>
                    Go to Homepage
                </Button>
            </Alert>
        </div>
    );
};

export default AccessBlocked;
