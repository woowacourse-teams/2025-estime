import IGlobe from '@/icons/IGlobe';
import ILock from '@/icons/ILock';

export const ACCESS_OPTIONS = [
  {
    value: 'public',
    flag: true,
    Icon: IGlobe,
    label: '공개',
    description: '누구나 이 페이지에 접근할 수 있습니다.',
  },
  {
    value: 'private',
    flag: false,
    Icon: ILock,
    label: '비공개',
    description: '링크를 가진 사람만 접근할 수 있습니다.',
  },
];
