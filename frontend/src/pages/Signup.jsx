import React from 'react';

function Signup() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-primary">Sign Up</h2>
        <form>
          <input className="w-full mb-4 p-2 border rounded" type="text" placeholder="First Name" />
          <input className="w-full mb-4 p-2 border rounded" type="text" placeholder="Last Name" />
          <input className="w-full mb-4 p-2 border rounded" type="email" placeholder="Email" />
          <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Password" />
          <button className="w-full bg-primary text-white py-2 rounded">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
