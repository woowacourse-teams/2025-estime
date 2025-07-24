import { joinUser } from '../../apis/room/room';
import { useState } from 'react';

export type LoginData = {
  name: string;
  password: string;
};
export function useUserLogin({ session }: { session: string | null }) {
  if (!session) {
    throw new Error('Session ID is required for user login');
  }
  const [userData, setUserData] = useState<LoginData>({ name: '', password: '' });

  const handleUserData = (data: LoginData) => setUserData(data);

  const handleLogin = async () => {
    try {
      if (!session) {
        throw new Error('세션이 없습니다. 로그인에 실패했습니다.');
      }
      if (userData.name.trim().length === 0) {
        throw new Error('아이디를 입력해주세요.');
      }
      await joinUser(session, {
        name: userData.name,
        password: userData.password,
      });
    } catch (err) {
      const e = err as Error;
      alert(e.message);
      console.error(err);
    }
  };

  return {
    name: userData.name,
    userData,
    handleUserData,
    handleLogin,
  };
}
