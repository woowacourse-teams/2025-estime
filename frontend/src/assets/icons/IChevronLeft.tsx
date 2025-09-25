import { IconType } from '@/shared/types/iconType';

const IChevronLeft = ({ ...props }: IconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-chevron-left-icon lucide-chevron-left"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
};

export default IChevronLeft;
