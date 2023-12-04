import React from "react";

interface CheckIconInterface {
  className?: string;
}

function CheckIcon({ className }: CheckIconInterface) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z"></path>
    </svg>
  );
}

export default React.memo(CheckIcon);
