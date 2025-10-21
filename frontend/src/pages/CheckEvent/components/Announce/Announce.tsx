import { createPortal } from 'react-dom';
import { useAnnounceContext } from '../../providers/AnnounceProvider';

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

// 3. 투표 버튼을 눌렀을때, 페이지가 전환되어서 드래그 모드를 진입해야 한다.
// 4. 드래그를 마치면, 투표 결과를 저장하게 해야한다.

export default Announce;
