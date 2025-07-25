import IGlobe from '@/icons/IGlobe';
import ILock from '@/icons/ILock';

interface AccessOption {
  value: 'public' | 'private';
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: '공개' | '비공개';
  description:
    | '시간 체크 후 즉시 통계를 확인할 수 있습니다.'
    | '시간 체크 후 마감기한이 지나야 통계를 확인할 수 있습니다.';
}

export const ACCESS_OPTIONS: AccessOption[] = [
  {
    value: 'public',
    Icon: IGlobe,
    label: '공개',
    description: '시간 체크 후 즉시 통계를 확인할 수 있습니다.',
  },
  {
    value: 'private',
    Icon: ILock,
    label: '비공개',
    description: '시간 체크 후 마감기한이 지나야 통계를 확인할 수 있습니다.',
  },
];
