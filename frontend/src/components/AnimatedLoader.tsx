import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { useTheme } from '../contexts/ThemeContext';

export const AnimatedLoader: React.FC = () => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { palette, darkMode } = useTheme();

  useEffect(() => {
    if (loaderRef.current) {
      anime({
        targets: loaderRef.current,
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad',
      });
    }
    anime({
      targets: dotsRef.current,
      translateY: [0, -12, 0],
      opacity: [0.5, 1, 0.5],
      delay: anime.stagger(150),
      duration: 900,
      loop: true,
      easing: 'easeInOutSine',
    });
  }, []);

  return (
    <div ref={loaderRef} className={`flex flex-col items-center justify-center h-screen w-full px-2 ${darkMode ? 'bg-[#23231A]' : 'bg-white'}`}>
      <div className="flex space-x-2 w-full justify-center">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            ref={el => (dotsRef.current[i] = el)}
            style={{ background: palette?.colors.primary || '#4B7F52' }}
            className="w-4 h-4 rounded-full"
          />
        ))}
      </div>
      <div className="mt-4 font-semibold text-base sm:text-lg tracking-wide animate-pulse text-center w-full" style={{ color: palette?.colors.primary || '#4B7F52' }}>Chargement...</div>
    </div>
  );
};
