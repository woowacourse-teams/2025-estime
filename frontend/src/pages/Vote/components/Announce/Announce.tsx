import { createPortal } from 'react-dom';
import { useAnnounceContext } from '@/shared/contexts/AnnounceContext';

const Announce = () => {
  const { roomInfoAnnounce, statisticsAnnounce } = useAnnounceContext();
  return createPortal(
    <div className="sr-only">
      <div ref={roomInfoAnnounce.srDivRef} aria-live="polite" aria-atomic="true" role="status" />
      <div ref={statisticsAnnounce.srDivRef} aria-live="polite" aria-atomic="true" role="status" />
    </div>,
    document.body
  );
};

export default Announce;
