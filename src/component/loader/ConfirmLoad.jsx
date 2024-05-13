import { useState, useEffect } from 'react'
import { apiAuhentication } from '../../utils/services';
import "./css/confirm.css"

function ConfirmLoad() {
  const [validateToken, setValidateToken] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  useEffect(() => {
    const fetchValidateToken = async () => {
      const response = await fetch(`${apiAuhentication}/users/register`);
      const data = await response.json();
      setTimeout(() => {
        setValidateToken(data.validateToken);
        if (!data.validateToken) {
          setIsEmailSent(true);
        }
      }, 120000);
    };
  
    fetchValidateToken();
  }, []);

  return (
    <>
      {validateToken && <div className="loader"></div>}
      {isEmailSent && <div>Un email de confirmation vous a été envoyé</div>}
    </>
  );
}

export default ConfirmLoad;