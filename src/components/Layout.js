import React,{ useEffect,useState } from 'react';
import { BeatLoader } from 'react-spinners';  // Import the BeatLoader component
import Sidebar from './Sidebar';
import TitleBar from './TitleBar';
import StatusBar from './StatusBar';
import { useAuth } from '@/context/AuthContext';
import LoginPage from './Login';

const Layout = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        // Simulate an asynchronous check for authentication status
        const checkAuthStatus = async () => {
            // Assuming you have some async logic here (e.g., fetching user data)
            // You can replace this with your actual authentication logic
            await new Promise((resolve) => setTimeout(resolve,1500));

            setLoading(false);
        };

        checkAuthStatus();
    },[]);

    if (loading) {
        // Render loading spinner while checking authentication status
        return (
            <div style={{ display: 'flex',justifyContent: 'center',alignItems: 'center',minHeight: '100vh' }}>
                <BeatLoader color="#007bff" loading={loading} size={15} />
            </div>
        );
    }

    if (!isLoggedIn) {
        // Redirect to login page if not logged in
        return <LoginPage />;
    } else {
        return (
            <div style={{ display: 'flex',flexDirection: 'column',minHeight: '100vh' }}>
                <TitleBar />
                <div style={{ display: 'flex' }}>
                    <Sidebar />
                    <div style={{ flex: 1,padding: '0rem 2rem',height: '100%',overflow: 'auto' }}>
                        {children}
                    </div>
                </div>
                <StatusBar />
            </div>
        );
    }
};

export default Layout;
