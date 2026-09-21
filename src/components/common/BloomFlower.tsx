import React from 'react';
import { FlowerType } from '../../types';

interface BloomFlowerProps {
  score: number;
  stage: 'seed' | 'sprout' | 'plant' | 'bud' | 'blooming' | 'full';
  flowerType?: FlowerType;
  size?: number;
  interactive?: boolean;
}

export const BloomFlower: React.FC<BloomFlowerProps> = ({
  score,
  stage,
  flowerType = 'tulip',
  size = 180,
  interactive = false
}) => {
  // Flower color palette based on type
  const getFlowerColors = () => {
    switch (flowerType) {
      case 'sunflower':
        return {
          primary: '#F59E0B',
          secondary: '#FBBF24',
          accent: '#D97706',
          center: '#78350F'
        };
      case 'rose':
        return {
          primary: '#E11D48',
          secondary: '#FB7185',
          accent: '#BE123C',
          center: '#FFE4E6'
        };
      case 'daisy':
        return {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          accent: '#E2E8F0',
          center: '#F59E0B'
        };
      case 'lavender':
        return {
          primary: '#8B5CF6',
          secondary: '#A78BFA',
          accent: '#7C3AED',
          center: '#DDD6FE'
        };
      case 'tulip':
      default:
        return {
          primary: '#FB7185', // blush rose
          secondary: '#FDA4AF',
          accent: '#F43F5E',
          center: '#FFE4E6'
        };
    }
  };

  const colors = getFlowerColors();

  return (
    <div 
      className={`relative flex items-center justify-center transition-transform duration-500 ${interactive ? 'hover:scale-105 cursor-pointer' : ''}`}
      style={{ width: size, height: size }}
      aria-label={`${flowerType} at ${stage} stage (${score}%)`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-sm select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="soilGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A88B77" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#A88B77" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>
          <linearGradient id="petalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.primary} />
          </linearGradient>
          <filter id="bloomGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base / Soil mound */}
        <ellipse cx="100" cy="172" rx="46" ry="14" fill="url(#soilGlow)" />
        <path
          d="M65 170 C 80 162, 120 162, 135 170 C 120 176, 80 176, 65 170 Z"
          fill="#D4C3B3"
          className="dark:fill-[#4A4036]"
        />

        {/* STAGE 1: SEED (0 - 20%) */}
        {stage === 'seed' && (
          <g className="transition-all duration-700 animate-pulse">
            <ellipse cx="100" cy="165" rx="9" ry="6" fill="#8C7355" />
            <path d="M100 160 C 102 156, 105 158, 103 162" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
            <circle cx="104" cy="158" r="2.5" fill="#86EFAC" />
          </g>
        )}

        {/* STAGE 2: SPROUT (21 - 40%) */}
        {stage === 'sprout' && (
          <g className="transition-all duration-700">
            {/* Tiny curved stem */}
            <path
              d="M100 166 Q 98 145 100 135"
              stroke="url(#stemGrad)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Left baby leaf */}
            <path
              d="M99 146 C 85 142, 85 130, 98 138"
              fill="#86EFAC"
              stroke="#4ADE80"
              strokeWidth="1.5"
            />
            {/* Right baby leaf */}
            <path
              d="M100 144 C 114 140, 114 128, 101 136"
              fill="#86EFAC"
              stroke="#4ADE80"
              strokeWidth="1.5"
            />
            {/* Tiny dewdrop */}
            <circle cx="90" cy="135" r="1.5" fill="#93C5FD" opacity="0.8" />
          </g>
        )}

        {/* STAGE 3: GROWING PLANT (41 - 60%) */}
        {stage === 'plant' && (
          <g className="transition-all duration-700">
            {/* Main stem */}
            <path
              d="M100 166 Q 96 130 100 100"
              stroke="url(#stemGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Lower leaf left */}
            <path
              d="M98 140 C 72 138, 70 118, 97 128"
              fill="#86EFAC"
              stroke="#22C55E"
              strokeWidth="1.5"
            />
            {/* Lower leaf right */}
            <path
              d="M99 130 C 125 125, 126 106, 99 118"
              fill="#86EFAC"
              stroke="#22C55E"
              strokeWidth="1.5"
            />
            {/* Upper leaf left */}
            <path
              d="M99 112 C 84 105, 82 92, 100 102"
              fill="#4ADE80"
              stroke="#16A34A"
              strokeWidth="1.5"
            />
            {/* Tip leaf */}
            <ellipse cx="100" cy="96" rx="4" ry="7" fill="#86EFAC" />
          </g>
        )}

        {/* STAGE 4: BUD (61 - 80%) */}
        {stage === 'bud' && (
          <g className="transition-all duration-700">
            {/* Stem */}
            <path
              d="M100 166 Q 97 120 100 85"
              stroke="url(#stemGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Side leaves */}
            <path
              d="M98 135 C 72 135, 72 110, 98 122"
              fill="#86EFAC"
              stroke="#22C55E"
              strokeWidth="1.5"
            />
            <path
              d="M100 120 C 128 116, 128 92, 100 108"
              fill="#86EFAC"
              stroke="#22C55E"
              strokeWidth="1.5"
            />
            {/* Calyx leaves hugging bud */}
            <path d="M94 85 C 88 78, 92 68, 97 72" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M106 85 C 112 78, 108 68, 103 72" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" />
            {/* Bud oval */}
            <ellipse cx="100" cy="74" rx="14" ry="20" fill="url(#petalGrad)" />
            <path d="M100 54 Q 95 72 100 90" stroke={colors.accent} strokeWidth="1.5" opacity="0.6" />
          </g>
        )}

        {/* STAGE 5: BLOOMING (81 - 99%) */}
        {stage === 'blooming' && (
          <g className="transition-all duration-700">
            {/* Stem */}
            <path
              d="M100 166 Q 96 115 100 80"
              stroke="url(#stemGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Leaves */}
            <path
              d="M98 135 C 68 132, 68 105, 98 120"
              fill="#86EFAC"
              stroke="#22C55E"
              strokeWidth="1.5"
            />
            <path
              d="M100 115 C 132 110, 130 85, 100 102"
              fill="#86EFAC"
              stroke="#22C55E"
              strokeWidth="1.5"
            />

            {/* Blooming Flower Heads depending on variety */}
            {flowerType === 'tulip' && (
              <g id="tulip_head">
                <path d="M78 68 C 72 40, 94 30, 98 68 Z" fill={colors.secondary} opacity="0.9" />
                <path d="M122 68 C 128 40, 106 30, 102 68 Z" fill={colors.secondary} opacity="0.9" />
                <path d="M82 72 C 80 34, 100 24, 100 75 Z" fill={colors.primary} />
                <path d="M118 72 C 120 34, 100 24, 100 75 Z" fill={colors.primary} />
                <path d="M88 75 C 90 40, 110 40, 112 75 C 104 84, 96 84, 88 75 Z" fill={colors.accent} />
              </g>
            )}

            {flowerType === 'sunflower' && (
              <g id="sunflower_head">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="100"
                    cy="68"
                    rx="8"
                    ry="24"
                    fill={colors.secondary}
                    transform={`rotate(${deg} 100 68)`}
                  />
                ))}
                <circle cx="100" cy="68" r="14" fill={colors.center} />
              </g>
            )}

            {flowerType === 'rose' && (
              <g id="rose_head">
                <circle cx="100" cy="65" r="25" fill={colors.primary} />
                <circle cx="100" cy="65" r="18" fill={colors.secondary} />
                <circle cx="100" cy="65" r="11" fill={colors.accent} />
                <path d="M96 61 C 100 58, 104 60, 104 66" stroke="#FFE4E6" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}

            {flowerType === 'daisy' && (
              <g id="daisy_head">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="100"
                    cy="66"
                    rx="5.5"
                    ry="22"
                    fill={colors.primary}
                    stroke={colors.accent}
                    strokeWidth="0.8"
                    transform={`rotate(${deg} 100 66)`}
                  />
                ))}
                <circle cx="100" cy="66" r="11" fill={colors.center} />
              </g>
            )}

            {flowerType === 'lavender' && (
              <g id="lavender_head">
                {[45, 53, 62, 71, 80].map((y, idx) => (
                  <g key={y}>
                    <ellipse cx="94" cy={y} rx="5" ry="4" fill={colors.primary} transform="rotate(-20 94 45)" />
                    <ellipse cx="106" cy={y} rx="5" ry="4" fill={colors.secondary} transform="rotate(20 106 45)" />
                    <ellipse cx="100" cy={y - 2} rx="4" ry="4" fill={colors.accent} />
                  </g>
                ))}
              </g>
            )}
          </g>
        )}

        {/* STAGE 6: FULL BLOOM (100%) */}
        {stage === 'full' && (
          <g className="transition-all duration-700 animate-[bounce_4s_infinite_ease-in-out]">
            {/* Radiant glow backdrop */}
            <circle cx="100" cy="65" r="48" fill={colors.primary} opacity="0.15" filter="url(#bloomGlow)" />

            {/* Stem */}
            <path
              d="M100 166 Q 95 115 100 78"
              stroke="url(#stemGrad)"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            {/* Lush leaves */}
            <path
              d="M98 135 C 62 132, 60 100, 98 116"
              fill="#86EFAC"
              stroke="#22C55E"
              strokeWidth="1.8"
            />
            <path
              d="M100 115 C 138 108, 138 80, 100 98"
              fill="#86EFAC"
              stroke="#22C55E"
              strokeWidth="1.8"
            />

            {/* Big Blossomed Head */}
            {flowerType === 'tulip' && (
              <g id="tulip_full">
                {/* Back petals */}
                <path d="M72 65 C 64 30, 94 18, 98 65 Z" fill={colors.secondary} />
                <path d="M128 65 C 136 30, 106 18, 102 65 Z" fill={colors.secondary} />
                {/* Mid petals */}
                <path d="M78 70 C 72 25, 100 15, 100 75 Z" fill={colors.primary} />
                <path d="M122 70 C 128 25, 100 15, 100 75 Z" fill={colors.primary} />
                {/* Front center petal */}
                <path d="M85 75 C 88 30, 112 30, 115 75 C 105 88, 95 88, 85 75 Z" fill={colors.accent} />
                {/* Golden pollen dust sparkles */}
                <circle cx="100" cy="42" r="2.5" fill="#FEF08A" />
                <circle cx="94" cy="46" r="2" fill="#FEF08A" />
                <circle cx="106" cy="46" r="2" fill="#FEF08A" />
              </g>
            )}

            {flowerType === 'sunflower' && (
              <g id="sunflower_full">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="100"
                    cy="65"
                    rx="8.5"
                    ry="28"
                    fill={colors.secondary}
                    transform={`rotate(${deg} 100 65)`}
                  />
                ))}
                <circle cx="100" cy="65" r="16" fill={colors.center} />
                {/* Sunflower seeds texture */}
                <circle cx="96" cy="62" r="1.5" fill="#D97706" />
                <circle cx="104" cy="62" r="1.5" fill="#D97706" />
                <circle cx="100" cy="68" r="1.5" fill="#D97706" />
              </g>
            )}

            {flowerType === 'rose' && (
              <g id="rose_full">
                <circle cx="100" cy="65" r="30" fill={colors.primary} />
                <circle cx="100" cy="65" r="22" fill={colors.secondary} />
                <circle cx="100" cy="65" r="14" fill={colors.accent} />
                <path d="M94 60 C 100 55, 106 58, 105 66" stroke="#FFE4E6" strokeWidth="3" strokeLinecap="round" />
              </g>
            )}

            {flowerType === 'daisy' && (
              <g id="daisy_full">
                {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="100"
                    cy="65"
                    rx="6.5"
                    ry="26"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    transform={`rotate(${deg} 100 65)`}
                  />
                ))}
                <circle cx="100" cy="65" r="13" fill="#F59E0B" />
              </g>
            )}

            {flowerType === 'lavender' && (
              <g id="lavender_full">
                {[35, 44, 53, 62, 71, 80].map((y) => (
                  <g key={y}>
                    <ellipse cx="92" cy={y} rx="6.5" ry="4.5" fill={colors.primary} transform="rotate(-25 92 45)" />
                    <ellipse cx="108" cy={y} rx="6.5" ry="4.5" fill={colors.secondary} transform="rotate(25 108 45)" />
                    <ellipse cx="100" cy={y - 3} rx="5" ry="4.5" fill={colors.accent} />
                  </g>
                ))}
              </g>
            )}

            {/* Sparkles on full bloom */}
            <g className="animate-spin" style={{ transformOrigin: '100px 65px', animationDuration: '16s' }}>
              <circle cx="62" cy="40" r="2" fill="#FCD34D" />
              <circle cx="138" cy="40" r="2.5" fill="#FCD34D" />
              <circle cx="145" cy="85" r="2" fill="#FCD34D" />
              <circle cx="55" cy="85" r="2" fill="#FCD34D" />
              <circle cx="100" cy="20" r="2" fill="#FCD34D" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
