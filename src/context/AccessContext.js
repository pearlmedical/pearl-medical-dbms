// context/AccessContext.js
import { createContext,useContext,useEffect,useState } from 'react';
import { useRouter } from 'next/router';

const AccessContext = createContext();

export const AccessProvider = ({ children }) => {
    const [accessLevels,setAccessLevels] = useState([]);
    const [employeeId,setEmployeeId] = useState(null); // Employee ID to fetch access levels
    const router = useRouter();

    useEffect(() => {
        // Fetch access levels here based on the employee ID whenever the route changes
        const fetchAccessLevels = async () => {
            try {
                const response = await fetch(`/api/employee/fetch-access-level-of-employee?employee_id=${employeeId}`);
                const data = await response.json();
                setAccessLevels(data.access_allowed || []);
            } catch (error) {
                console.error('Error fetching access levels:',error);
            }
        };

        // Fetch access levels on mount and whenever employeeId or route changes
        if (employeeId) {
            fetchAccessLevels();
        }

        // Set up route change event listener to fetch access levels when the route changes
        const handleRouteChange = () => {
            if (employeeId) {
                fetchAccessLevels();
            }
        };

        // Attach the event listener
        router.events.on('routeChangeComplete',handleRouteChange);

        // Clean up the event listener on component unmount
        return () => {
            router.events.off('routeChangeComplete',handleRouteChange);
        };
    },[employeeId,router]);

    // Function to set the employee ID when needed
    const setEmployeeIdAndFetch = (newEmployeeId) => {
        setEmployeeId(newEmployeeId);
    };

    return (
        <AccessContext.Provider value={{ accessLevels,setEmployeeIdAndFetch }}>
            {children}
        </AccessContext.Provider>
    );
};

export const useAccess = () => {
    const context = useContext(AccessContext);
    if (!context) {
        throw new Error('useAccess must be used within an AccessProvider');
    }
    return context;
};
