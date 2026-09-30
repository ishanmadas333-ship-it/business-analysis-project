import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export function Logo({ className = '', size = 'md', showTagline = false }: LogoProps) {
  const iconSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Protective Shield + Growth Emblem SVG Icon */}
      <div className={`relative flex items-center justify-center ${iconSize} rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 shadow-md shadow-emerald-500/20 text-white p-1.5`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          {/* Protective Shield Outline */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          {/* Upward Growth Arrow inside the Shield */}
          <path d="M8 13.5L10.5 11L13 13L16 9" stroke="white" strokeWidth="2" />
          <path d="M13.5 9H16V11.5" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${textSize}`}>
            Startup
          </span>
          <span className={`font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent ml-1 ${textSize}`}>
            Sheild
          </span>
          <span className="ml-1.5 px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            MVP
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-normal">
            See Your Business Before You Build It
          </span>
        )}
      </div>
    </div>
  );
}
