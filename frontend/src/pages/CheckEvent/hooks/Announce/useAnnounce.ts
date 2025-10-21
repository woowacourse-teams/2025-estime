import useAriaPolite from '@/shared/hooks/common/useAriaPolite';

const useAnnounce = () => {
  const roomInfoAnnounce = useAriaPolite();
  const statisticsAnnounce = useAriaPolite();

  return {
    roomInfoAnnounce,
    statisticsAnnounce,
  };
};

export default useAnnounce;
