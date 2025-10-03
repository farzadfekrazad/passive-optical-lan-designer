
import React, { useState } from 'react';
import { authService } from '../auth/authService';
import type { User } from '../types';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'verify';

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const result = authService.login(email, password);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setError(result.message);
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const result = authService.register(email, password);
    if (result.success) {
      setMessage(result.message);
      setMode('verify');
    } else {
      setError(result.message);
    }
  };
  
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const result = authService.verify(email, verifyCode);
     if (result.success) {
      setMessage(result.message);
      setMode('login');
    } else {
      setError(result.message);
    }
  };
  
  const renderForm = () => {
    switch (mode) {
      case 'register':
        return (
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-cyan-400">Register New Account</h2>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">Register</button>
            <p className="text-center text-sm text-gray-400">
              Already have an account? <button type="button" onClick={() => setMode('login')} className="font-semibold text-cyan-400 hover:underline">Login</button>
            </p>
          </form>
        );
      case 'verify':
        return (
           <form onSubmit={handleVerify} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-cyan-400">Verify Your Account</h2>
            <p className="text-center text-sm text-gray-400">A verification code was sent to your console. Please enter it below.</p>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input type="email" value={email} readOnly className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Verification Code</label>
              <input type="text" value={verifyCode} onChange={e => setVerifyCode(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">Verify</button>
          </form>
        );
      case 'login':
      default:
        return (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-cyan-400">Login</h2>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">Login</button>
            <p className="text-center text-sm text-gray-400">
              No account? <button type="button" onClick={() => setMode('register')} className="font-semibold text-cyan-400 hover:underline">Register</button>
            </p>
             <div className="text-xs text-center text-gray-500 pt-4">
                <p>Default admin: <span className="font-mono">admin@pol.designer</span></p>
                <p>Password: <span className="font-mono">admin123</span></p>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-cyan-400">Passive Optical LAN (POL) Designer</h1>
        </div>
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl">
            {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
            {message && <p className="bg-green-900/50 text-green-300 p-3 rounded-md mb-4 text-sm">{message}</p>}
            {renderForm()}
        </div>
    </div>
  );
};

export default AuthView;
