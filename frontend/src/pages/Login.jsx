import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
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
        <form className="w-full mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
          <input className="w-full mb-4 p-2 border rounded bg-[#f8fafc]" id="email" type="email" placeholder="m@example.com" />
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <Link to="#" className="text-xs text-primary hover:underline">Forgot your password?</Link>
          </div>
          <input className="w-full mb-4 p-2 border rounded bg-[#f8fafc]" id="password" type="password" placeholder="" />
          <button type="submit" className="w-full bg-primary text-white py-2 rounded mb-2 font-semibold">Login</button>
          <button type="button" className="w-full border border-primary text-primary py-2 rounded font-semibold mb-2 bg-white">Login with Google</button>
        </form>
        <div className="text-center text-sm text-gray-500 mt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
