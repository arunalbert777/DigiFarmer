import React from "react";

export default function DashboardBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Karnataka flag ribbon top-left */}
      <svg
        className="absolute top-0 left-0 w-96 h-56 opacity-30 transform -translate-x-1/3 -translate-y-1/4"
        viewBox="0 0 600 360"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="600" height="180" fill="#FFD100" />
        <rect y="180" width="600" height="180" fill="#FF0000" />
        <g transform="translate(40,40)" fill="#ffffff" opacity="0.15">
          <circle cx="40" cy="40" r="6" />
          <circle cx="80" cy="80" r="6" />
          <circle cx="20" cy="110" r="6" />
        </g>
      </svg>

      {/* Karnataka flag ribbon bottom-right mirrored */}
      <svg
        className="absolute bottom-0 right-0 w-96 h-56 opacity-28 transform translate-x-1/3 translate-y-1/6"
        viewBox="0 0 600 360"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="600" height="180" fill="#FFD100" />
        <rect y="180" width="600" height="180" fill="#FF0000" />
        <g
          transform="translate(460,200) rotate(20)"
          fill="#ffffff"
          opacity="0.12"
        >
          <rect x="0" y="0" width="80" height="6" rx="3" />
          <rect x="0" y="20" width="60" height="6" rx="3" />
          <rect x="10" y="40" width="40" height="6" rx="3" />
        </g>
      </svg>

      {/* Stylized farm fields pattern center-left */}
      <svg
        className="absolute left-8 top-40 w-80 h-72 opacity-25"
        viewBox="0 0 200 180"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#d4f1c5" />
            <stop offset="100%" stopColor="#a7d89c" />
          </linearGradient>
        </defs>
        <rect width="200" height="180" fill="url(#g1)" rx="12" />
        <path
          d="M0 140 Q50 100 100 140 T200 140 V180 H0 Z"
          fill="#7bb06f"
          opacity="0.55"
        />
        <g fill="#ffffff" opacity="0.06">
          <path d="M10 30 L30 20 L25 40 Z" />
          <path d="M40 60 L60 50 L55 70 Z" />
          <path d="M80 90 L100 80 L95 100 Z" />
        </g>
      </svg>

      {/* Kannada text watermark */}
      <div className="absolute right-24 top-28 transform rotate-12 opacity-15 text-7xl font-bold text-yellow-600 select-none pointer-events-none">
        <span style={{ fontFamily: "Noto Sans Kannada, sans-serif" }}>
          ಕೃಷಿ
        </span>
      </div>

      {/* Farmer silhouette (simple) */}
      <svg
        className="absolute bottom-8 left-12 w-48 h-48 text-green-900 opacity-30"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g fill="currentColor">
          <circle cx="18" cy="12" r="4" />
          <path d="M22 18c4 0 8 2 10 6l4 8-6 2-3-6c-1-1-3-2-5-2H18v-8c0-1 2-4 4-4z" />
          <path d="M44 36c0 0-2 4-2 6s2 4 4 4 6-2 6-4-4-8-8-6z" />
        </g>
      </svg>

      {/* Subtle grain icons along bottom */}
      <svg
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-12 opacity-12"
        viewBox="0 0 600 60"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g fill="#f59e0b">
          {Array.from({ length: 20 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <path
              key={i}
              d={`M${30 + i * 28} 40 c-4 -6 -4 -12 0 -18 c3 6 3 12 0 18 z`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
