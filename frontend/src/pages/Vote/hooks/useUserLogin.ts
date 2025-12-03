import { joinUser } from '@/apis/room/room';
import useFetch from '@/shared/hooks/common/useFetch';
import { userNameStore } from '../stores/userNameStore';

export type LoginData = {
  name: string;
};
const useUserLogin = ({ session }: { session: string }) => {
  const { isLoading: isLoginLoading, triggerFetch: performLogin } = useFetch({
    context: 'performLogin',
    requestFn: async () => {
      const name = userNameStore.getSnapshot().name;
      return await joinUser(session, {
        participantName: name,
      });
    },
  });

  return {
    performLogin,
    isLoginLoading,
  };
};
export default useUserLogin;
