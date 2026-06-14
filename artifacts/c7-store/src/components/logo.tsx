import React from "react";

export function Logo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="translate(50, 50) rotate(45) translate(-50, -50)">
        <rect width="100" height="100" rx="16" fill="#66CC00" />
      </g>
      <text
        x="50"
        y="65"
        fontFamily="Montserrat, sans-serif"
        fontSize="44"
        fontWeight="800"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="-2"
      >
        C7
      </text>
    </svg>
  );
}
