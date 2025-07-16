import { useEffect, RefObject } from 'react';
import gsap from 'gsap';

export function useFadeIn(ref: RefObject<HTMLElement>, delay = 0) {
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay, ease: 'power2.out' }
      );
    }
  }, [ref, delay]);
}

export function useStaggerFadeIn(refs: RefObject<HTMLElement>[], stagger = 0.15) {
  useEffect(() => {
    const elements = refs.map(r => r.current).filter(Boolean);
    if (elements.length) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger, ease: 'power2.out' }
      );
    }
  }, [refs, stagger]);
}
