import { IconType } from '@/types/iconType';

const IArrow = ({ color, ...props }: IconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-chevron-down-icon lucide-chevron-down"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};

export default IArrow;
