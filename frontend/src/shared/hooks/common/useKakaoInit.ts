import { useEffect } from 'react';

const useKakaoInit = () => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.KAKAO_JAVASCRIPT_KEY);
    }
  }, []);
};

export default useKakaoInit;
