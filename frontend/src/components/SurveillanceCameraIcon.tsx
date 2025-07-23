import React from 'react';

interface SurveillanceCameraIconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const SurveillanceCameraIcon: React.FC<SurveillanceCameraIconProps> = ({ 
  size = 20, 
  className = "", 
  strokeWidth = 2 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
      <path d="M21 15.5c-1.5 1.5-3.5 2.5-6 2.5s-4.5-1-6-2.5" />
    </svg>
  );
};

export default SurveillanceCameraIcon;