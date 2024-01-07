import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import Sidebar from './Sidebar';
import TitleBar from './TitleBar';
import StatusBar from './StatusBar';
import { useAuth } from '@/context/AuthContext';
import LoginPage from './LoginPage';
import { useRouter } from 'next/router';
import AccessBlocked from './AccessBlocked';

const Layout = ({ children }) => {
    const { isLoggedIn, employeeID } = useAuth();
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(null);
    const [showAccessBlocked, setShowAccessBlocked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                if (!employeeID || !router.pathname) {
                    return;
                }

                const isHomePage = router.pathname === '/' || router.pathname === '/sales' || router.pathname === '/enquiries' || router.pathname === '/admin';

                if (isHomePage) {
                    setHasAccess(true);
                    setLoading(false);
                    return;
                }

                setLoading(true); // Set loading to true when starting to fetch
                const response = await fetch(`/api/employee/fetch-employee-file-access?employee_id=${employeeID}&access_level_file=${router.pathname.split('/').pop()}`);

                if (response.ok) {
                    const data = await response.json();
                    setHasAccess(data.access);
                } else {
                    console.error('Error checking file access:', response.statusText);
                    setHasAccess(false);
                }
            } catch (error) {
                console.error('Error checking file access:', error);
                setHasAccess(false);
            } finally {
                setLoading(false); // Set loading to false after fetching (success or failure)
            }
        };

        checkAuthStatus();
    }, [router.pathname, employeeID]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAccessBlocked(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, [showAccessBlocked]);

    if (!isLoggedIn) {
        // Redirect to login page if not logged in
        return <LoginPage />;
    }

    // Display loading spinner until both employeeID and router.pathname are available
    if (loading || !employeeID || !router.pathname) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <BeatLoader color="#007bff" loading={loading} size={15} />
            </div>
        );
    } else if (!hasAccess) {
        // Show AccessBlocked component after a delay
        if (showAccessBlocked) {
            return <AccessBlocked />;
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <TitleBar />
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '0rem 2rem', height: '100%', overflow: 'auto' }}>
                    {children}
                </div>
            </div>
            <StatusBar />
        </div>
    );
};

export default Layout;
