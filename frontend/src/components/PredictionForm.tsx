import React, { useState, useRef } from 'react';
import { useFadeIn, useStaggerFadeIn } from './gsap-animations';

export const PredictionForm = () => {
  const [features, setFeatures] = useState({});
  const [result, setResult] = useState(null);
  const formRef = useRef<HTMLFormElement>(null);
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  useFadeIn(formRef, 0.1);
  useStaggerFadeIn([input1Ref, input2Ref], 0.2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatures({ ...features, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/predict/production', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features }),
    });
    const data = await res.json();
    setResult(data.prediction);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto mt-10 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">Prédiction de rendement</h2>
      <input ref={input1Ref} name="feature1" onChange={handleChange} placeholder="Feature 1" className="block w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
      <input ref={input2Ref} name="feature2" onChange={handleChange} placeholder="Feature 2" className="block w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
      {/* Ajoutez d'autres champs selon vos besoins */}
      <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">Prédire</button>
      {result && <div className="mt-6 text-center text-lg font-medium text-green-700 animate-fade-in">Résultat : {result}</div>}
    </form>
  );
};
