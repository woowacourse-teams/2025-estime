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

  const handleModalLogin = async () => {
    if (!session) {
      return;
    }
    try {
      const response = await joinPerson(session, {
        name: userData.userid,
        password: userData.password,
      });
      console.log(response);
      handleCloseAllModal();
    } catch (e) {
      console.error('Error closing suggest modal:', e);
      alert(`${e}로그인 실패!  꺄약!`);
    }
  };
  return {
    userData,
    setUserData,
    handleModalLogin,
  };
}
