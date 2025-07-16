import { useEffect, useState } from 'react';

/**
 * useScrollTrigger - Hook React pour détecter le scroll et déclencher une action.
 * @param triggerPoint (number) - Position Y (en px) à partir de laquelle le trigger s'active
 * @returns {boolean} - true si le scroll a dépassé le triggerPoint
 */
export function useScrollTrigger(triggerPoint: number = 100): boolean {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > triggerPoint) {
        setTriggered(true);
      } else {
        setTriggered(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerPoint]);

  return triggered;
}
