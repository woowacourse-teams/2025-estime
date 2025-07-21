import { IconType } from '@/types/iconType';

const IChevronRight = ({ ...props }: IconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-chevron-right-icon lucide-chevron-right"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
};

export default IChevronRight;
