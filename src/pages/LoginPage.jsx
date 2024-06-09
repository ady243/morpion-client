import {useContext, useState} from 'react';
import FormBuilder from "../component/FormBuilder.jsx";
import { useNavigate } from 'react-router-dom';
import {AuthContext} from "../context/AuthContext.jsx";

const LoginPage = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { loginUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const inputStyle = { 
        width: '100%',
        padding: '15px',
        fontSize: '1rem',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        color: '#444',
        display: 'flex',
        marginBottom: '20px', 
        border: '1px solid #ddd',
    };

    const buttonLogin = {
        width: '100%',
        backgroundColor: '#09bbbe',
        color: 'white',
        padding: '15px 0',
        margin: '10px 0',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        border: 'none',
    };

    const fields = [
        {
            type: 'email',
            name: 'email',
            label: 'Email*      ',
            placeholder: 'Email',
            required: true,
            value: email,
            onChange: (e) => setEmail(e.target.value),
            style: inputStyle
        },
        {
            type: 'password',
            name: 'password',
            label: 'Password*',
            placeholder: 'Password',
            required: true,
            value: password,
            onChange: (e) => setPassword(e.target.value), 
            style: inputStyle
        },
        {
            type: 'button',     
            label: 'Login', 
            onClick: async () => {
                const error = await loginUser(email, password);
                if (error) {
                    setError(error);
                } else {
                    navigate('/');
                }
            },
            style: buttonLogin
        }
    ];

    return (
        <div className='text-center mt-28'>
            <h1 style={{fontSize: '2rem', color: '#444'}}>Connexion</h1>
            {error && error.error && <p className="text-red-500 text-sm">{error.message}</p>}
            <div className="bg-white rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto">
                <FormBuilder fields={fields} />
                <p className="text-sm text-gray-600 mt-4">
                  Don&apos;t have an account?  <a href="/register" className="text-indigo-600 hover:text-indigo-700">Register</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;