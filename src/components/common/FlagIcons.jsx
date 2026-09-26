import React from 'react';

export function FlagUZ({ className = "w-5 h-3.5" }) {
  return (
    <svg viewBox="0 0 500 250" className={`${className} rounded-sm shadow-sm inline-block shrink-0`} aria-label="Uzbekistan Flag">
      <rect width="500" height="250" fill="#1EB53A" />
      <rect width="500" height="166.7" fill="#FFFFFF" />
      <rect width="500" height="83.3" fill="#0099B5" />
      <rect y="80.8" width="500" height="5" fill="#CE1126" />
      <rect y="164.2" width="500" height="5" fill="#CE1126" />
      <circle cx="70" cy="41.7" r="30" fill="#FFFFFF" />
      <circle cx="78" cy="41.7" r="25" fill="#0099B5" />
      {/* Stars */}
      <g fill="#FFFFFF">
        <circle cx="120" cy="20" r="4" /><circle cx="140" cy="20" r="4" /><circle cx="160" cy="20" r="4" />
        <circle cx="120" cy="42" r="4" /><circle cx="140" cy="42" r="4" /><circle cx="160" cy="42" r="4" /><circle cx="180" cy="42" r="4" />
        <circle cx="100" cy="64" r="4" /><circle cx="120" cy="64" r="4" /><circle cx="140" cy="64" r="4" /><circle cx="160" cy="64" r="4" /><circle cx="180" cy="64" r="4" />
      </g>
    </svg>
  );
}

export function FlagRU({ className = "w-5 h-3.5" }) {
  return (
    <svg viewBox="0 0 450 300" className={`${className} rounded-sm shadow-sm inline-block shrink-0`} aria-label="Russian Flag">
      <rect width="450" height="300" fill="#D52B1E" />
      <rect width="450" height="200" fill="#0039A6" />
      <rect width="450" height="100" fill="#FFFFFF" />
    </svg>
  );
}

export function FlagEN({ className = "w-5 h-3.5" }) {
  return (
    <svg viewBox="0 0 60 30" className={`${className} rounded-sm shadow-sm inline-block shrink-0`} aria-label="UK / English Flag">
      <clipPath id="uk-clip">
        <rect width="60" height="30" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0 v30 M0 15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0 v30 M0 15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
