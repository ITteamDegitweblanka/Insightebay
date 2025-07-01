import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setToken } from '../utils/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col items-center">
        <div className="mb-4 flex flex-col items-center">
          <div className="mb-2">
            {/* Simple logo icon */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="18" height="4" rx="2" fill="#2563eb"/>
              <rect x="3" y="10" width="18" height="4" rx="2" fill="#2563eb" fillOpacity="0.7"/>
              <rect x="3" y="15" width="18" height="4" rx="2" fill="#2563eb" fillOpacity="0.4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary">Insight-eBay</h1>
          <p className="text-gray-500 mt-2 text-center text-sm">Enter your email below to login to your account</p>
        </div>
        <form className="w-full mt-2" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Username</label>
          <input
            className="w-full mb-4 p-2 border rounded bg-[#f8fafc]"
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <Link to="#" className="text-xs text-primary hover:underline">Forgot your password?</Link>
          </div>
          <input
            className="w-full mb-4 p-2 border rounded bg-[#f8fafc]"
            id="password"
            type="password"
            placeholder=""
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          <button type="submit" className="w-full bg-primary text-white py-2 rounded mb-2 font-semibold">Login</button>
          <button type="button" className="w-full border border-primary text-primary py-2 rounded font-semibold mb-2 bg-white" disabled>Login with Google</button>
        </form>
        {/* Signup link removed: users are created by admin only */}
      </div>
    </div>
  );
}

export default Login;
