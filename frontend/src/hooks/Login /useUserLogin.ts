import { joinPerson } from '@/apis/room/room';
import { useState } from 'react';

export type LoginData = {
  userid: string;
  password: string;
};
export function useUserLogin(session: string | null, handleCloseAllModal: () => void) {
  if (!session) {
    throw new Error('Session ID is required for user login');
  }
  const [userData, setUserData] = useState<LoginData>({ userid: '', password: '' });
  const [responseUserName, setResponseUserName] = useState<string | null>(null);
  const handleModalLogin = async () => {
    try {
      if (!session) {
        throw new Error('세션이 없습니다. 로그인에 실패했습니다.');
      }
      if (userData.userid.trim().length === 0 || userData.password.trim().length === 0) {
        throw new Error('아이디와 비밀번호를 입력해주세요.');
      }
      const response = await joinPerson(session, {
        name: userData.userid,
        password: userData.password,
      });
      setResponseUserName(response.name);
      handleCloseAllModal();
    } catch (e) {
      console.error('Error closing suggest modal:', e);
      alert(`${e}로그인 실패! 다시 시도해주세요.`);
    }
  };
  return {
    userData,
    setUserData,
    handleModalLogin,
    responseUserName,
  };
}
