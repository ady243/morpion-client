import { createContext, useCallback, useState, useEffect } from "react";
import {postRequest, apiAuhentication} from "../utils/services.js";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [register, setRegister] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const [login, setLogin] = useState({
        email: '',
        password: '',
    });

  
    useEffect(() => {
        const storeUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storeUser) {
            setUser(JSON.parse(storeUser));
        }
        if (storedToken) {
            setToken(storedToken)
        }
        setIsLoading(false); 
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [user, token]);


    const updateRegister = (key, value) => {
        setRegister({
            ...register,
            [key]: value
        });
    };

    const registerUser = useCallback(async () => {
        try {
            const response = await postRequest(
                `${apiAuhentication}/users/register`,
                register
            );

            if (!response.ok) {
                throw response;
            }

            const data = await response.json();
        
            setUser(data.user);
        } catch (error) {
            console.error(error);
        }
    }, [register]);

    const updateLogin = (key, value) => {
        setLogin({
            ...login,
            [key]: value
        });
    };

    const loginUser = async (email, password) => {
        try {
            const response = await fetch(`${apiAuhentication}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw data;
            }
            setToken(data.token); 
            setCurrentUser(data.user); 
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{
            user: currentUser,
            currentUser,
            token,
            logout,
            register: registerUser,
            loginUser,
            updateRegister,
            updateLogin,
        }}>
            {children}
        </AuthContext.Provider>
    );
};