import { useState, useContext } from 'react';
import FormBuilder from '../component/FormBuilder';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { register, updateRegister } = useContext(AuthContext);
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

    const buttonRegister = {
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
            type: 'text',
            name: 'fullName',
            label: 'FullName*',
            placeholder: 'Full Name',
            required: true,
            value: fullName, 
            onChange: (e) => {
                setFullName(e.target.value);
                updateRegister('fullName', e.target.value);
            },
            style: inputStyle
        },
        {
            type: 'email',
            name: 'email',
            label: 'Email* ',
            placeholder: 'Email',
            required: true,
            value: email, 
            onChange: (e) => {
                setEmail(e.target.value);
                updateRegister('email', e.target.value);
            },
            style: inputStyle
        },
        {
            type: 'password',
            name: 'password',
            label: 'password*',
            placeholder: 'password',
            required: true,
            value: password, 
            onChange: (e) => {
                setPassword(e.target.value);
                updateRegister('password', e.target.value);
            },
            style: inputStyle
        },
        {
            type: 'button', 
            label: 'Create Account', 
            onClick: async () => {
                try {
                    const success = await register();
                    if (success) {
                        navigate('/email-wait');
                    } else {
                        setError({ message: 'Registration failed. Please try again.' });
                    }
                } catch (error) {
                    setError(error);
                }
            },
            style: buttonRegister
        }
    ];

    return (
        <div className='text-center mt-28'>
            <h1 style={{ fontSize: '2rem', color: '#444' }}>Créer un compte</h1>
            {error && error.message && <p className="text-red-500 text-sm">{error.message}</p>}
            <div className="bg-white rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto">
                <FormBuilder fields={fields} />
                <p className="text-sm text-gray-600 mt-4">
                    Already have account? <a href="/login" className="text-indigo-600 hover:text-indigo-700">Login</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
