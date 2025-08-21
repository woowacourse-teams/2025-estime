import { joinUser } from '../../apis/room/room';
import { useRef, useState } from 'react';

export type LoginData = {
  name: string;
};
export function useUserLogin({ session }: { session: string | null }) {
  if (!session) {
    throw new Error('Session ID is required for user login');
  }
  const [userData, setUserData] = useState<LoginData>({ name: '' });

  const handleUserData = (data: LoginData) => setUserData(data);
  const isLoggedIn = useRef(false);
  const isLoginLoading = useRef(false);

  const handleLogin = async (): Promise<boolean> => {
    if (userData.name.trim().length === 0) {
      throw new Error('아이디를 입력해주세요.');
    }
    if (isLoginLoading.current) {
      throw new Error('로그인 중입니다. 잠시 후 다시 시도해주세요.');
    }

    isLoginLoading.current = true;
    try {
      const response = await joinUser(session, {
        participantName: userData.name.trim(),
      });
      return response.isDuplicateName;
    } finally {
      isLoginLoading.current = false;
    }
  };

  const handleLoggedIn = {
    setTrue: () => (isLoggedIn.current = true),
    setFalse: () => (isLoggedIn.current = false),
  };
  const resetUserData = () => setUserData({ name: '' });
  return {
    name: userData.name,
    userData,
    handleUserData,
    handleLogin,
    handleLoggedIn,
    resetUserData,
    isLoggedIn: isLoggedIn.current,
  };
}
