import IGlobe from '@/icons/IGlobe';
import ILock from '@/icons/ILock';

interface AccessOption {
  value: 'public' | 'private';
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: '공개' | '비공개';
  description: '누구나 이 페이지에 접근할 수 있습니다.' | '링크를 가진 사람만 접근할 수 있습니다.';
}

export const ACCESS_OPTIONS: AccessOption[] = [
  {
    value: 'public',
    Icon: IGlobe,
    label: '공개',
    description: '누구나 이 페이지에 접근할 수 있습니다.',
  },
  {
    value: 'private',
    Icon: ILock,
    label: '비공개',
    description: '링크를 가진 사람만 접근할 수 있습니다.',
  },
];
