import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { appwriteAuth } from '../Auth/Appwriteauth';

const Verify = () => {
  const [message, setMessage] = useState('Verifying...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    if (userId && secret) {
      appwriteAuth.confirmVerification(userId, secret).then(res => {
        setMessage(res.message);
        appwriteAuth.logout();
        setTimeout(() => {
          navigate('/');
        }, 3000);
      });
    } else {
      setMessage("Invalid verification link.");
      appwriteAuth.logout();

    }
  }, [searchParams]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{color:"white"}} >Email Verification</h2>
      <p  style={{color:"white"}}>{message}</p>
    </div>
  );
};

export default Verify;