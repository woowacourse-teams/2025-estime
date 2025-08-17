import { useEffect } from 'react';
import Button from '../Button';
import Text from '../Text';
import IChat from '@/icons/IChat';

const KakaoShareButton = ({ link }: { link: string }) => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.KAKAO_JAVASCRIPT_KEY);
    }
  }, []);

  const handleShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      return;
    }

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '약속 시간 정하기',
        description: '지금 방에 들어와서 함께 약속 시간을 정해주세요!',
        imageUrl: '',
        link: {
          mobileWebUrl: link,
          webUrl: link,
        },
      },
    });
  };

  return (
    <Button color="kakao" selected={true} onClick={handleShare}>
      <IChat />
      <Text variant="h4"> 카카오톡으로 공유하기</Text>
    </Button>
  );
};

export default KakaoShareButton;
