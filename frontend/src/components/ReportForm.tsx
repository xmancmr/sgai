import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ReportForm = () => {
  const [data] = useState([]);
  const [reportUrl, setReportUrl] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/report/csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data }),
    });
    const result = await res.json();
    setReportUrl(result.path);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Générer un rapport CSV</h2>
      {/* Ajoutez des champs pour saisir les données */}
      <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded">Générer</button>
      {reportUrl && <a href={reportUrl} className="block mt-4 text-blue-700 underline">Télécharger le rapport</a>}
    </form>
  );
};
