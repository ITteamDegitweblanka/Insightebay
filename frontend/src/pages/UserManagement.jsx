import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch users
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers);
  }, [success]);

  // Add user
  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const token = getToken();
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add user');
      setSuccess('User added!');
      setName(''); setEmail(''); setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    setError(''); setSuccess('');
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      setSuccess('User deleted!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Only allow access if user is admin
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.isAdmin) {
    return <div className="text-center text-red-600 mt-10 font-bold">Access denied: Admins only</div>;
  }
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <form onSubmit={handleAdd} className="mb-6 flex flex-col gap-2">
        <input className="border p-2 rounded" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input className="border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input className="border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
        <button className="bg-primary text-white py-2 rounded">Add User</button>
        {error && <div className="text-red-500 text-xs">{error}</div>}
        {success && <div className="text-green-600 text-xs">{success}</div>}
      </form>
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="text-gray-500 text-xs uppercase tracking-wider">
            <th>Name</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
