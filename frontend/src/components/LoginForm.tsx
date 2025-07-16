import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Remplacez l'URL par celle de votre endpoint login
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.access_token);
      setError('');
    } else {
      setError('Identifiants invalides');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Connexion</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Nom d'utilisateur" className="block w-full mb-2 px-4 py-2 border rounded" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="block w-full mb-4 px-4 py-2 border rounded" />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Se connecter</button>
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </form>
  );
};
