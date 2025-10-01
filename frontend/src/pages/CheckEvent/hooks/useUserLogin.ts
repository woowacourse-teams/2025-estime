import { joinUser } from '@/apis/room/room';
import useFetch from '@/shared/hooks/common/useFetch';
import { useRef, useState, useCallback } from 'react';

export type LoginData = {
  name: string;
};
const useUserLogin = ({ session }: { session: string | null }) => {
  if (!session) {
    throw new Error('Session ID is required for user login');
  }
  const [userData, setUserData] = useState<LoginData>({ name: '' });
  const { isLoading: isLoginLoading, triggerFetch: userLoginSubmit } = useFetch({
    context: 'handleLogin',
    requestFn: () =>
      joinUser(session, {
        participantName: userData.name.trim(),
      }),
  });
  const isLoggedIn = useRef(false);

  const handleUserData = (data: LoginData) => setUserData(data);

  const handleLogin = useCallback(async (): Promise<boolean | undefined> => {
    if (userData.name.trim().length === 0) {
      throw new Error('아이디를 입력해주세요.');
    }

    const response = await userLoginSubmit();

    return response?.isDuplicateName;
  }, [userData.name, userLoginSubmit]);

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
    resetUserData,
    isLoggedIn: isLoggedIn.current,
    handleLoggedIn,
    isLoginLoading,
  };
};
export default useUserLogin;
