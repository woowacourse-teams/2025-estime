import { useEffect, useState } from 'react';

const useShakeAnimation = () => {
  const [shouldShake, setShouldShake] = useState(false);

  const handleShouldShake = () => {
    setShouldShake(true);
  };

  useEffect(() => {
    if (shouldShake) {
      const timer = setTimeout(() => {
        setShouldShake(false);
      }, 460);

      return () => clearTimeout(timer);
    }
  }, [shouldShake]);

  return {
    shouldShake,
    handleShouldShake,
  };
};

export default useShakeAnimation;
