function IChevronLeft({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-chevron-left-icon lucide-chevron-left"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export default IChevronLeft;
