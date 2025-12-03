import { useEffect, useRef, useState } from 'react';

const useAnimationEnd = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName === 'transform') {
        setIsAnimating(false);
      }
    };
    element.addEventListener('transitionend', onEnd);
    return () => element.removeEventListener('transitionend', onEnd);
  }, []);

  const startAnimation = () => {
    setIsAnimating(true);
  };

  return {
    isAnimating,
    startAnimation,
    ref,
  };
};

export default useAnimationEnd;
