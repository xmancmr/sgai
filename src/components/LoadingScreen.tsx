import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Leaf, Sun, Zap } from 'lucide-react';
import agriDomLogo from '@/assets/agri-dom-logo.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    { text: "Initialisation du système agricole...", icon: Sprout },
    { text: "Chargement des données météorologiques...", icon: Sun },
    { text: "Synchronisation des parcelles...", icon: Leaf },
    { text: "Finalisation de l'environnement...", icon: Zap }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(stepTimer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center z-50"
      >
        <div className="text-center space-y-8 max-w-md mx-auto px-6">
          {/* Logo animé */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <motion.img
              src={agriDomLogo}
              alt="Agri Dom Logo"
              className="w-32 h-18 mx-auto mb-4"
              animate={{ 
                filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Particules flottantes */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse delay-300" />
            <div className="absolute -bottom-2 -left-1 w-1 h-1 bg-green-600 rounded-full animate-pulse delay-700" />
          </motion.div>

          {/* Titre */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-green-800 mb-2">Agri Dom</h1>
            <p className="text-green-600 text-lg">Gestion Agricole Intelligente</p>
          </motion.div>

          {/* Étapes de chargement */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-3 text-green-700">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {React.createElement(loadingSteps[currentStep]?.icon || Sprout, { 
                  className: "h-5 w-5 text-green-600" 
                })}
              </motion.div>
              <span className="text-sm font-medium">
                {loadingSteps[currentStep]?.text || "Chargement..."}
              </span>
            </div>

            {/* Barre de progression */}
            <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Pourcentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-green-600 text-sm font-medium"
            >
              {Math.round(loadingProgress)}%
            </motion.div>
          </motion.div>

          {/* Animation de background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-green-300 rounded-full opacity-30"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 20
                }}
                animate={{
                  y: -20,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: Math.random() * 3 + 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;