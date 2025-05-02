import React from "react";

const SuccessIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="24" cy="24" r="24" fill="#4CAF50" />
      <path
        d="M34.2857 16L20.5714 29.7143L13.7143 22.8571"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SuccessIcon;
