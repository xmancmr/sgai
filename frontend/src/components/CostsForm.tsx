import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const CostsForm = () => {
  const [features, setFeatures] = useState({});
  const [result, setResult] = useState(null);
  const { token } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatures({ ...features, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/predict/costs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ features }),
    });
    const data = await res.json();
    setResult(data.prediction);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Prédiction des coûts</h2>
      <input name="feature1" onChange={handleChange} placeholder="Feature 1" className="block w-full mb-4 px-4 py-2 border rounded" />
      <input name="feature2" onChange={handleChange} placeholder="Feature 2" className="block w-full mb-6 px-4 py-2 border rounded" />
      <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded">Prédire</button>
      {result && <div className="mt-6 text-center text-lg font-medium text-green-700">Résultat : {result}</div>}
    </form>
  );
};
