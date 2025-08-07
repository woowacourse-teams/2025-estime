import { joinUser } from '../../apis/room/room';
import { useRef, useState } from 'react';

export type LoginData = {
  name: string;
};
export function useUserLogin({
  session,
  onDuplicateNickname,
}: {
  session: string | null;
  onDuplicateNickname?: () => void;
}) {
  if (!session) {
    throw new Error('Session ID is required for user login');
  }
  const [userData, setUserData] = useState<LoginData>({ name: '' });

  const handleUserData = (data: LoginData) => setUserData(data);
  const isLoggedIn = useRef(false);

  const handleLogin = async (): Promise<boolean> => {
    if (userData.name.trim().length === 0) {
      throw new Error('아이디를 입력해주세요.');
    }
    const response = await joinUser(session, {
      participantName: userData.name,
    });

    if (response.isDuplicateName) {
      onDuplicateNickname?.();
      return true;
    }
    isLoggedIn.current = true;
    return false;
  };
  const resetUserData = () => setUserData({ name: '' });
  return {
    name: userData.name,
    userData,
    handleUserData,
    handleLogin,
    resetUserData,
    isLoggedIn: isLoggedIn.current,
  };
}
