const Lock = ({
  color = '#fff',
  ...props
}: {
  color?: string;
  props?: React.SVGProps<SVGSVGElement>;
}) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 8.25H4.5C3.67157 8.25 3 8.92157 3 9.75V15C3 15.8284 3.67157 16.5 4.5 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V9.75C16.5 8.92157 15.8284 8.25 15 8.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 8.25V5.25C6 4.25544 6.39509 3.30161 7.09835 2.59835C7.80161 1.89509 8.75544 1.5 9.75 1.5C10.7446 1.5 11.6984 1.89509 12.4017 2.59835C13.1049 3.30161 13.5 4.25544 13.5 5.25V8.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Lock;
