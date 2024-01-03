// context/AuthContext.js
import { createContext,useContext,useEffect,useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [userType,setUserType] = useState(''); // 'admin' or 'employee'

    useEffect(() => {
        // Check if user is already logged in from sessionStorage
        const storedLoginState = sessionStorage.getItem('loginState');
        if (storedLoginState) {
            const { isLoggedIn,userType } = JSON.parse(storedLoginState);
            setIsLoggedIn(isLoggedIn);
            setUserType(userType);
        }
    },[]);

    const login = (userType) => {
        setIsLoggedIn(true);
        setUserType(userType);
        // Store login state in sessionStorage
        sessionStorage.setItem('loginState',JSON.stringify({ isLoggedIn: true,userType }));
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserType('');
        // Clear login state from sessionStorage
        sessionStorage.removeItem('loginState');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn,userType,login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
