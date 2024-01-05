// context/AuthContext.js
import { createContext,useContext,useEffect,useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [employeeID,setEmployeeID] = useState(null);

    useEffect(() => {
        // Check if the user is already logged in from sessionStorage
        const storedLoginState = sessionStorage.getItem('loginState');
        if (storedLoginState) {
            const { isLoggedIn,employeeID } = JSON.parse(storedLoginState);
            setIsLoggedIn(isLoggedIn);
            setEmployeeID(employeeID);
        }
    },[]);

    const login = (employeeID) => {
        setIsLoggedIn(true);
        setEmployeeID(employeeID);
        // Store login state in sessionStorage
        sessionStorage.setItem('loginState',JSON.stringify({ isLoggedIn: true,employeeID }));
    };

    const logout = () => {
        setIsLoggedIn(false);
        setEmployeeID(null);
        // Clear login state from sessionStorage
        sessionStorage.removeItem('loginState');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn,employeeID,login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
