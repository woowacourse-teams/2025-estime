import Globe from '@/icons/Globe';
import Lock from '@/icons/Lock';

export const ACCESS_OPTIONS = [
  {
    value: 'public',
    Icon: Globe,
    label: '공개',
    description: '누구나 이 페이지에 접근할 수 있습니다.',
  },
  {
    value: 'private',
    Icon: Lock,
    label: '비공개',
    description: '링크를 가진 사람만 접근할 수 있습니다.',
  },
];
