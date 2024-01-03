// components/Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import TitleBar from './TitleBar';
import StatusBar from './StatusBar';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/pages/login';

const Layout = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        // Redirect to login page if not logged in
        return <LoginPage />;
        // return null;
    }

    return (
        <div style={{ display: 'flex',flexDirection: 'column',minHeight: '100vh' }}>
            <TitleBar />
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1,padding: '0rem 2rem',height: '100%',overflow: 'auto' }}>{children}</div>
            </div>
            <StatusBar />
        </div>
    );
};

export default Layout;
