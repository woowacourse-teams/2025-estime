import { useState } from 'react';

const useShakeAnimation = () => {
  const [shouldShake, setShouldShake] = useState(false);

  const handleShouldShake = () => {
    setShouldShake(true);

    setTimeout(() => {
      setShouldShake(false);
    }, 460);
  };

  return {
    shouldShake,
    handleShouldShake,
  };
};

export default useShakeAnimation;
