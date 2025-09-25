import { type IconType } from '@/shared/types/iconType';

const ISuccess = ({ color = '#14A44D', ...props }: IconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="11"
      viewBox="0 0 14 11"
      fill="none"
      {...props}
    >
      <path
        d="M13.7071 0.594644C14.0976 0.993362 14.0976 1.64088 13.7071 2.0396L5.70796 10.2054C5.31738 10.6041 4.68307 10.6041 4.29249 10.2054L0.292936 6.12248C-0.0976453 5.72376 -0.0976453 5.07624 0.292936 4.67752C0.683517 4.2788 1.31782 4.2788 1.7084 4.67752L5.00179 8.03633L12.2947 0.594644C12.6853 0.195925 13.3196 0.195925 13.7102 0.594644H13.7071Z"
        fill={color}
      />
    </svg>
  );
};

export default ISuccess;
