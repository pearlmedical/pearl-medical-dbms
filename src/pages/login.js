// pages/login.js
import { useEffect,useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
    const [loginId,setLoginId] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const { login,isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect to home if user is already logged in
        if (isLoggedIn) {
            router.push('/');
        }
    },[isLoggedIn,router]);

    const handleLogin = () => {
        // Perform authentication logic here
        // For simplicity, let's assume some predefined admin and employee login details

        if (loginId === 'admin' && password === 'admin') {
            login('admin');
            router.push('/');
        } else if (loginId === 'employee' && password === 'employee') {
            login('employee');
            router.push('/');
        } else {
            setError('Invalid login credentials');
        }
    };

    return (
        <div>
            <h2>Login Page</h2>
            <label>
                Login ID:
                <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
            </label>
            <br />
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LoginPage;
