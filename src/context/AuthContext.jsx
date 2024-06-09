import { createContext, useCallback, useState, useEffect } from "react";
import {postRequest, apiAuhentication} from "../utils/services.js";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [register, setRegister] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const [login, setLogin] = useState({
        email: '',
        password: '',
    });
    const getToken = () => {
        const storedToken = localStorage.getItem('token');
        return storedToken ? storedToken : null;
    };
  
    useEffect(() => {
        const storeUser = localStorage.getItem('user');
        if (storeUser) {
            setUser(JSON.parse(storeUser));
        }
        setIsLoading(false); 
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        if (getToken()) {
            localStorage.setItem('token', getToken());
        } else {
            localStorage.removeItem('token');
        }
    }, [user]);


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
            console.log(data);
            console.log(data.user);
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
            localStorage.setItem('token', data.token); 
            setCurrentUser(data.user);
            setUser(data.user); 
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user: currentUser,
            currentUser,
            token: getToken(), 
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