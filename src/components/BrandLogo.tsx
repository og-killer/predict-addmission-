import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  collapsed?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'light',
  collapsed = false
}) => {
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Heraldic Academic Shield Insignia */}
      <div className="relative w-10 h-10 shrink-0">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Outer Shield Path */}
          <path
            d="M24 3L8 9V22C8 32.5 14.8 41.8 24 45C33.2 41.8 40 32.5 40 22V9L24 3Z"
            fill="url(#shield_grad_unipath)"
            stroke="url(#shield_border_unipath)"
            strokeWidth="1.5"
          />

          {/* Inner Inset Border */}
          <path
            d="M24 6L11 11V22C11 30.5 16.5 38.3 24 41C31.5 38.3 37 30.5 37 22V11L24 6Z"
            stroke="#93C5FD"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />

          {/* Open Book of Knowledge */}
          <path
            d="M17 24C20 22.5 22.5 23 24 24C25.5 23 28 22.5 31 24V32C28 30.5 25.5 31 24 32C22.5 31 20 30.5 17 32V24Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />
          <line
            x1="24"
            y1="24"
            x2="24"
            y2="32"
            stroke="#1E3A8A"
            strokeWidth="1.2"
          />

          {/* Star of Enlightenment */}
          <path
            d="M24 11L25.3 14.7L29 16L25.3 17.3L24 21L22.7 17.3L19 16L22.7 14.7L24 11Z"
            fill="#FBBF24"
          />

          {/* Gradients */}
          <defs>
            <linearGradient
              id="shield_grad_unipath"
              x1="8"
              y1="3"
              x2="40"
              y2="45"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1E3A8A" />
              <stop offset="0.5" stopColor="#0F172A" />
              <stop offset="1" stopColor="#0A1128" />
            </linearGradient>
            <linearGradient
              id="shield_border_unipath"
              x1="8"
              y1="3"
              x2="40"
              y2="45"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#60A5FA" />
              <stop offset="0.5" stopColor="#3B82F6" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-none">
            <span
              className={`font-black text-xl tracking-tight ${
                isLight ? 'text-white' : 'text-slate-900'
              }`}
            >
              UNI<span className="text-blue-500">PATHWAY</span>
            </span>
          </div>
          <span
            className={`text-[9px] font-semibold tracking-wider uppercase mt-0.5 ${
              isLight ? 'text-blue-200/80' : 'text-slate-500'
            }`}
          >
            National Merit &amp; Admissions Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
