import { useState, useCallback } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SERVICEABLE_PINCODES = ['500001', '500002', '500003', '500004'];

export const usePincode = () => {
  const [pincode, setPincode] = useState('');
  const [isServiceable, setIsServiceable] = useState(null);
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);

  const checkPincode = useCallback(async (code) => {
    const pincodeValue = code || pincode;
    
    if (!pincodeValue || pincodeValue.length !== 6) {
      setIsServiceable(null);
      setMessage('');
      return null;
    }

    // Quick local check first
    const isLocal = SERVICEABLE_PINCODES.includes(pincodeValue);
    
    try {
      setChecking(true);
      const response = await axios.post(`${API}/check-pincode`, { pincode: pincodeValue });
      setIsServiceable(response.data.serviceable);
      setMessage(response.data.message);
      return response.data;
    } catch (err) {
      // Fallback to local check
      setIsServiceable(isLocal);
      setMessage(isLocal ? 'Service Available' : 'Not Serviceable in this area');
      return { serviceable: isLocal, message: isLocal ? 'Service Available' : 'Not Serviceable' };
    } finally {
      setChecking(false);
    }
  }, [pincode]);

  const resetPincode = useCallback(() => {
    setPincode('');
    setIsServiceable(null);
    setMessage('');
  }, []);

  return {
    pincode,
    setPincode,
    isServiceable,
    message,
    checking,
    checkPincode,
    resetPincode
  };
};

export default usePincode;
