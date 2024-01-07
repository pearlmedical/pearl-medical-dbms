import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

const LoginPage = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if the user is already logged in
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/employee/login-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: loginId,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.employee_id);
        router.push('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid login credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Internal Server Error');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Container className="mt-5" style={{ backgroundColor: '#d1ecf1', padding: '20px', borderRadius: '10px' }}>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4">Login Page</h2>
          <Form>
            <Form.Group controlId="loginId">
              <Form.Label>Login ID:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your login ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleLogin} className="mt-3">
              Login
            </Button>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
