import IChat from '@/assets/icons/IChat';
import useKakaoInit from '@/shared/hooks/common/useKakaoInit';
import Button from '..';
import Text from '../../Text';

const KakaoShareButton = ({ onClick }: { onClick: () => void }) => {
  useKakaoInit();

  return (
    <Button color="kakao" selected={true} onClick={onClick}>
      <IChat />
      <Text variant="h4" color="kakaoLabel">
        카카오톡으로 공유하기
      </Text>
    </Button>
  );
};

export default KakaoShareButton;
