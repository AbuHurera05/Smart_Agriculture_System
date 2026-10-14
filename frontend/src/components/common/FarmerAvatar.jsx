import React from 'react'

/**
 * FarmerAvatar - AsanKisan mascot/logo featuring a proud, smiling Kisan
 * wearing a traditional vibrant Pagri (turban), mustache, and kurta.
 *
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl' | number} [props.size='md']
 * @param {string} [props.className]
 * @param {boolean} [props.withRing=true]
 * @param {boolean} [props.animated=false]
 */
export default function FarmerAvatar({
  size = 'md',
  className = '',
  withRing = true,
  animated = false,
  ...props
}) {
  const sizeMap = {
    xs: 28,
    sm: 36,
    md: 44,
    lg: 56,
    xl: 72,
    '2xl': 96,
    '3xl': 128,
  }

  const dimension = typeof size === 'number' ? size : sizeMap[size] || 44

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center select-none ${
        withRing ? 'rounded-full ring-2 ring-emerald-500/30 shadow-sm' : ''
      } ${animated ? 'transition-transform duration-300 hover:scale-105' : ''} ${className}`}
      style={{ width: dimension, height: dimension }}
      aria-label="AsanKisan Farmer Avatar"
      {...props}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Background circle gradient */}
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          {/* Saffron / Golden Turban gradients */}
          <linearGradient id="pagriMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="pagriFold1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <linearGradient id="pagriFold2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Skin tones */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="35%" stopColor="#f6ad55" />
            <stop offset="100%" stopColor="#ed8936" />
          </linearGradient>

          {/* Kurta white/mint gradient */}
          <linearGradient id="kurtaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Gold badge gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Outer Circular Badge */}
        <circle cx="60" cy="60" r="58" fill="url(#bgGrad)" stroke="#86efac" strokeWidth="2.5" />
        
        {/* Subtle agricultural sun ray / aura */}
        <circle cx="60" cy="60" r="51" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

        {/* Shoulders / Kurta Collar */}
        <path
          d="M24 116 C24 96 38 88 60 88 C82 88 96 96 96 116 Z"
          fill="url(#kurtaGrad)"
        />
        {/* Kurta V-Neck placket */}
        <path
          d="M54 88 L60 102 L66 88"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Kurta Button */}
        <circle cx="60" cy="107" r="1.8" fill="#15803d" />

        {/* Wheat pin on Kurta */}
        <path
          d="M38 97 C42 94 45 95 46 99 C44 101 40 100 38 97 Z"
          fill="url(#goldGrad)"
        />
        <line x1="42" y1="96" x2="44" y2="103" stroke="#b45309" strokeWidth="1" />

        {/* Neck */}
        <rect x="52" y="74" width="16" height="17" rx="3" fill="#ed8936" />
        {/* Neck shadow */}
        <path d="M52 74 C56 79 64 79 68 74 L68 78 C64 81 56 81 52 78 Z" fill="#c05621" opacity="0.4" />

        {/* Ears */}
        {/* Left Ear */}
        <ellipse cx="38" cy="59" rx="4.5" ry="7" fill="#f6ad55" />
        <ellipse cx="38.5" cy="59" rx="2.5" ry="4" fill="#dd6b20" opacity="0.4" />
        {/* Right Ear */}
        <ellipse cx="82" cy="59" rx="4.5" ry="7" fill="#f6ad55" />
        <ellipse cx="81.5" cy="59" rx="2.5" ry="4" fill="#dd6b20" opacity="0.4" />

        {/* Face Shape */}
        <path
          d="M40 48 C40 38 80 38 80 48 C80 68 75 79 60 79 C45 79 40 68 40 48 Z"
          fill="url(#skinGrad)"
        />

        {/* Cheeks subtle warm glow */}
        <circle cx="46" cy="61" r="4.5" fill="#f87171" opacity="0.25" />
        <circle cx="74" cy="61" r="4.5" fill="#f87171" opacity="0.25" />

        {/* Eyes (Friendly & Smiling) */}
        {/* Left Eye */}
        <path
          d="M47 52 C49 49 54 49 56 52"
          stroke="#1c1917"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <circle cx="51.5" cy="53.5" r="1.3" fill="#1c1917" />
        {/* Right Eye */}
        <path
          d="M64 52 C66 49 71 49 73 52"
          stroke="#1c1917"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <circle cx="68.5" cy="53.5" r="1.3" fill="#1c1917" />

        {/* Eyebrows */}
        <path d="M46 47 C49 45 54 45 57 47" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
        <path d="M63 47 C66 45 71 45 74 47" stroke="#292524" strokeWidth="2" strokeLinecap="round" />

        {/* Nose */}
        <path
          d="M59 52 L58 59 C58 61 62 61 62 59"
          stroke="#c05621"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Smile (under mustache) */}
        <path
          d="M54 69 C57 72 63 72 66 69"
          stroke="#991b1b"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Proud Kisan Mustache (Iconic Desi Moochh) */}
        <path
          d="M60 63 C56 61 48 61 44 65 C43 66 45 67 47 66 C51 64 56 65 60 67 C64 65 69 64 73 66 C75 67 77 66 76 65 C72 61 64 61 60 63 Z"
          fill="#1c1917"
        />

        {/* ======================================================== */}
        {/* PAGRI (TURBAN) - Beautiful wrap folds & crown */}
        {/* ======================================================== */}
        
        {/* Pagri Base Crown dome */}
        <path
          d="M32 40 C32 18 88 18 88 40 C88 45 84 48 81 48 C75 42 45 42 39 48 C35 48 32 45 32 40 Z"
          fill="url(#pagriMain)"
        />

        {/* Top Pagri Shamla / Peak Plume Fold */}
        <path
          d="M50 20 C54 11 66 11 70 20 C64 16 56 16 50 20 Z"
          fill="url(#pagriFold1)"
        />
        {/* Top fold rib lines */}
        <path d="M56 15 L58 20" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M64 15 L62 20" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

        {/* Pagri Layer 1 - Upper Left Wrap */}
        <path
          d="M30 36 C34 22 56 18 78 22 C64 26 42 28 30 36 Z"
          fill="url(#pagriFold1)"
        />

        {/* Pagri Layer 2 - Right Diagonal Wrap */}
        <path
          d="M40 22 C62 21 86 26 90 38 C80 32 58 30 40 22 Z"
          fill="url(#pagriFold2)"
        />

        {/* Pagri Layer 3 - Main Front Overlapping Wrap (Right to Center) */}
        <path
          d="M32 42 C40 33 60 30 88 34 C89 39 86 44 82 45 C66 38 48 38 32 42 Z"
          fill="url(#pagriMain)"
        />

        {/* Pagri Layer 4 - Front Forehead Band (Left to Center-Right) */}
        <path
          d="M31 43 C46 36 68 36 86 43 C88 46 84 49 80 48 C66 42 48 42 34 48 C31 46 30 44 31 43 Z"
          fill="url(#pagriFold1)"
        />

        {/* Pagri Central Fold Knot / Peak overlap */}
        <path
          d="M54 36 C58 33 62 33 66 36 C64 42 56 42 54 36 Z"
          fill="#b45309"
        />

        {/* Emerald Gem / Agronomy Crest on the Turban center */}
        <circle cx="60" cy="38" r="3.2" fill="#10b981" stroke="#fef08a" strokeWidth="1" />
        <circle cx="59.3" cy="37.2" r="1" fill="#ffffff" />

        {/* Subtle highlight sheen across the turban cloth */}
        <path
          d="M38 32 C48 26 66 26 80 30"
          stroke="#fef08a"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M36 41 C48 37 68 37 82 42"
          stroke="#fef08a"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}
