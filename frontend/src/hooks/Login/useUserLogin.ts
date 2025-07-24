import { joinUser } from '../../apis/room/room';
import { useState } from 'react';

export type LoginData = {
  name: string;
  password: string;
};
export function useUserLogin({
  session,
  handleCloseAllModal,
}: {
  session: string | null;
  handleCloseAllModal: () => void;
}) {
  if (!session) {
    throw new Error('Session ID is required for user login');
  }
  const [userData, setUserData] = useState<LoginData>({ name: '', password: '' });
  const [name, setName] = useState<string>('앙구일구');

  const handleUserData = (data: LoginData) => setUserData(data);

  const handleModalLogin = async () => {
    try {
      if (!session) {
        throw new Error('세션이 없습니다. 로그인에 실패했습니다.');
      }
      if (userData.name.trim().length === 0) {
        throw new Error('아이디를 입력해주세요.');
      }
      const response = await joinUser(session, {
        name: userData.name,
        password: userData.password,
      });
      setName(response.name);
      handleCloseAllModal();
    } catch (err) {
      const e = err as Error;
      alert(e.message);
      console.error(err);
    }
  };

  return {
    userData,
    handleUserData,
    handleModalLogin,
    name,
  };
}
