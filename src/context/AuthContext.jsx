import { createContext, useCallback, useState } from "react";
import { postRequest, apiAuhentication } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [register, setRegister] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const updateRegister = (key, value) => {
        setRegister({
            ...register,
            [key]: value
        });
    }

    const registerUser = useCallback(async () => {
        try {
            const response = await postRequest(
                `${apiAuhentication}/users/register`,
                register
            )
    
            const data = await response.json();
            console.log(data);
    
            if (!response.ok) {
                throw data; 
            }
            console.log(data.user);
            setUser(data.user);
        } catch (error) {
            console.error(error);
    
        }
    }, [register]); 

    return (
        <AuthContext.Provider value={{
            user,
            register: registerUser,
            updateRegister,
        }}>
            {children}
        </AuthContext.Provider>
    );
}