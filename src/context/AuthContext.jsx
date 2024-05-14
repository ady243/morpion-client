import { createContext, useCallback, useState, useEffect } from "react";
import { postRequest, apiAuhentication } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null)
    const [register, setRegister] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const [login, setLogin] = useState({
        email:'',
        password:'',
    })
   
    useEffect(()=>{
        const storeUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if(storeUser){
            setUser(JSON.parse(storeUser));
        }
        if(storedToken){
            setToken(storedToken)
        }
    }, [])

    useEffect(()=>{
        if(user){
            localStorage.setItem('user', JSON.stringify(user));
        }else{
            localStorage.removeItem('token');
        }
        if(token){
            localStorage.setItem('token', token);
        }else{
            localStorage.removeItem('token');
        }
    }, [user, token])

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
    
    const updateLogin = (key, value) =>{
        setLogin({
            ...login,
            [key]: value
        })
    }
    
    const loginUser = useCallback(async () => {
        try{
            const response = await postRequest(
                `${apiAuhentication}/users/login`,
                login
            )
    
            if(!response.ok){
                throw response;
            }
    
            const data = await response.json();
            console.log(data.user);
            setUser(data.user);
            setToken(data.token)
        }catch(error){
            console.error(error)
        }
    }, [login])


    return (
        <AuthContext.Provider value={{
            user,
            token,
            register: registerUser,
            login:loginUser,
            updateRegister,
            updateLogin,
        }}>
            {children}
        </AuthContext.Provider>
    );
}