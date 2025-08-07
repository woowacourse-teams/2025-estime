import { useState } from 'react';

const useShakeAnimation = () => {
  const [shouldShake, setShouldShake] = useState(false);

  const handleShouldShake = () => {
    const newShouldShake = true;
    setShouldShake(newShouldShake);

    if (newShouldShake) {
      const timer = setTimeout(() => {
        setShouldShake(false);
      }, 460);

      return () => clearTimeout(timer);
    }
  };

  return {
    shouldShake,
    handleShouldShake,
  };
};

export default useShakeAnimation;
