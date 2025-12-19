import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminLogin = () => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all digits entered
    if (index === 3 && value) {
      const fullPin = [...newPin.slice(0, 3), value.slice(-1)].join('');
      if (fullPin.length === 4) {
        handleSubmit(fullPin);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const newPin = pastedData.split('');
      setPin(newPin);
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (pinValue) => {
    const fullPin = pinValue || pin.join('');
    
    if (fullPin.length !== 4) {
      setError('Please enter 4-digit PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/admin/verify`, { pin: fullPin });
      
      if (response.data.success) {
        // Store admin session
        sessionStorage.setItem('adminAuth', 'true');
        toast.success('Access granted!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Invalid PIN. Please try again.');
      setPin(['', '', '', '']);
      document.getElementById('pin-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 text-sm">Enter your 4-digit PIN to continue</p>
        </div>

        {/* PIN Input */}
        <div className="bg-gray-800 rounded-2xl p-8" data-testid="pin-container">
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-14 h-14 text-center text-2xl font-bold bg-gray-700 border-2 rounded-xl text-white focus:outline-none focus:border-primary transition-colors ${
                  error ? 'border-red-500' : 'border-gray-600'
                }`}
                data-testid={`pin-input-${index}`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4" data-testid="pin-error">
              {error}
            </p>
          )}

          <Button
            onClick={() => handleSubmit()}
            disabled={loading || pin.some(d => !d)}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 disabled:opacity-50"
            data-testid="submit-pin-btn"
          >
            {loading ? 'Verifying...' : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Back Link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          <a href="/" className="hover:text-white transition-colors">
            ← Back to Store
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
