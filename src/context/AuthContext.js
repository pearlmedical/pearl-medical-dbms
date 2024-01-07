// context/AuthContext.js
import { createContext,useContext,useEffect,useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [employeeID,setEmployeeID] = useState(null);
    const [accessLevels,setAccessLevels] = useState([]);

    useEffect(() => {
        // Check if the user is already logged in from sessionStorage
        const storedLoginState = sessionStorage.getItem('loginState');
        if (storedLoginState) {
            const { isLoggedIn,employeeID,accessLevels } = JSON.parse(storedLoginState);
            setIsLoggedIn(isLoggedIn);
            setEmployeeID(employeeID);
            setAccessLevels(accessLevels);
        }
    },[]);

    const login = async (employeeID) => {
        setIsLoggedIn(true);
        setEmployeeID(employeeID);

        try {
            const response = await fetch(`/api/employee/fetch-access-level-of-employee?employee_id=${employeeID}`);
            const data = await response.json();
            const levels = data.access_allowed || [];
            setAccessLevels(levels);
            console.log('Employee access levels in state:',levels);
            // Store login state in sessionStorage
            sessionStorage.setItem('loginState',JSON.stringify({ isLoggedIn: true,employeeID,accessLevels: levels }));
        } catch (error) {
            console.error('Error fetching employee access levels:',error);
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setEmployeeID(null);
        setAccessLevels([]);
        // Clear login state from sessionStorage
        sessionStorage.removeItem('loginState');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn,employeeID,accessLevels,login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
