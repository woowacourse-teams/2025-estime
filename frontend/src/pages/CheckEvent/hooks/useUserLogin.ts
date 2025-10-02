import { joinUser } from '@/apis/room/room';
import useFetch from '@/shared/hooks/common/useFetch';
import { userNameStore } from '../stores/userNameStore';

export type LoginData = {
  name: string;
};
const useUserLogin = ({ session }: { session: string }) => {
  const { isLoading: isLoginLoading, triggerFetch: handleLogin } = useFetch({
    context: 'handleLogin',
    requestFn: () =>
      // const name = userNameStore.getSnapshot();
      joinUser(session, {
        participantName: userNameStore.getSnapshot(),
      }),
  });

  return {
    handleLogin,
    isLoginLoading,
  };
};
export default useUserLogin;
