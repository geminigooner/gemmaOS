/**
 * GEMMAOS — CUSTOM 2D VECTOR ARTWORK & CHUNKY TOY-LIKE ICON SYSTEM
 * Implements the Visual Design System: saturated lavender/violet/purple,
 * bubblegum pink, warm cream, thick deep-plum outlines (#2A114B),
 * flat 2D illustration style, stars, hearts, clouds, and sakura blossoms.
 */

import React from 'react';
import { WallpaperScene } from '../core/store';

// 4-point cute star SVG
export function SparkleStar({
  className = 'w-6 h-6',
  fill = '#FFE47A',
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 36 36" className={className} fill="none">
      <path
        d="M18 2C19.5 11.5 24.5 16.5 34 18C24.5 19.5 19.5 24.5 18 34C16.5 24.5 11.5 19.5 2 18C11.5 16.5 16.5 11.5 18 2Z"
        fill={fill}
        stroke="#2A114B"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Retro Cute Pink Computer with Heart Screen (Welcome Hub Hero Left)
export function CuteRetroComputerSVG({ className = 'w-32 h-28' }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 130" className={className} fill="none">
      {/* Motion lines */}
      <path
        d="M12 36L22 41M10 48L20 50M14 25L24 33"
        stroke="#2A114B"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M136 28L126 34M139 40L128 43M134 52L125 52"
        stroke="#2A114B"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Monitor back casing */}
      <rect
        x="30"
        y="18"
        width="76"
        height="62"
        rx="12"
        fill="#B66DFF"
        stroke="#2A114B"
        strokeWidth="4"
      />
      {/* Monitor front bezel */}
      <rect
        x="38"
        y="14"
        width="76"
        height="62"
        rx="12"
        fill="#FF66B5"
        stroke="#2A114B"
        strokeWidth="4"
      />
      {/* Inner CRT Screen */}
      <rect
        x="47"
        y="23"
        width="58"
        height="44"
        rx="8"
        fill="#FFA8D8"
        stroke="#2A114B"
        strokeWidth="3.5"
      />
      {/* Heart on Screen */}
      <path
        d="M76 56C76 56 61 46.5 61 37.5C61 33 64.8 30 69 30C72.2 30 74.8 31.8 76 34.2C77.2 31.8 79.8 30 83 30C87.2 30 91 33 91 37.5C91 46.5 76 56 76 56Z"
        fill="#FF3D9A"
        stroke="#2A114B"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Monitor Stand Neck */}
      <rect
        x="62"
        y="76"
        width="28"
        height="10"
        fill="#9B5DE5"
        stroke="#2A114B"
        strokeWidth="3.5"
      />
      {/* Keyboard Base */}
      <path
        d="M36 86H114L126 110C127.5 113 125.3 116 122 116H28C24.7 116 22.5 113 24 110L36 86Z"
        fill="#FFE49E"
        stroke="#2A114B"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Keyboard Keys */}
      <path
        d="M44 95H54M60 95H70M76 95H86M92 95H104M40 104H52M58 104H92M98 104H110"
        stroke="#2A114B"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Cute Ringed Planet & Sparkles (Welcome Hub Hero Right)
export function CutePlanetSVG({ className = 'w-32 h-28' }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 125" className={className} fill="none">
      {/* Top Left Star */}
      <path
        d="M28 14C29.5 22 33 25.5 41 27C33 28.5 29.5 32 28 40C26.5 32 23 28.5 15 27C23 25.5 26.5 22 28 14Z"
        fill="#FFE47A"
        stroke="#2A114B"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Top Right Small Sparkle */}
      <path
        d="M126 10C127 15 129.5 17.5 134.5 18.5C129.5 19.5 127 22 126 27C125 22 122.5 19.5 117.5 18.5C122.5 17.5 125 15 126 10Z"
        fill="#FFE47A"
        stroke="#2A114B"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Bottom Right Small Sparkle */}
      <path
        d="M128 88C129 93 131.5 95.5 136.5 96.5C131.5 97.5 129 100 128 105C127 100 124.5 97.5 119.5 96.5C124.5 95.5 127 93 128 88Z"
        fill="#FFE47A"
        stroke="#2A114B"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Planet Body */}
      <circle
        cx="82"
        cy="64"
        r="32"
        fill="#C77DFF"
        stroke="#2A114B"
        strokeWidth="4"
      />
      {/* Planet Shading Crescent */}
      <path
        d="M62 40C74 34 92 38 102 50C110 62 106 80 94 88C102 76 100 56 86 46C76 39 68 39 62 40Z"
        fill="#E0AAFF"
      />
      {/* Planet Ring Foreground */}
      <path
        d="M42 79C33 77 32 68 48 60C64 52 94 46 114 48C130 50 132 59 116 68C100 77 62 83 42 79Z"
        stroke="#2A114B"
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M37 74C29 70 35 61 56 53C77 45 107 43 122 48C131 51 128 60 110 68"
        stroke="#FFE49E"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M36 74C28 70 34 61 55 53C76 45 106 43 121 48C130 51 127 60 109 68"
        stroke="#2A114B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Left Rail & Bottom Dock Chunky Icons
export function ChunkyIcon({
  name,
  className = 'w-9 h-9',
}: {
  name:
    | 'home'
    | 'files'
    | 'apps'
    | 'ai'
    | 'agents'
    | 'models'
    | 'memory'
    | 'settings'
    | 'terminal'
    | 'globe'
    | 'gallery'
    | 'music'
    | 'play';
  className?: string;
}) {
  switch (name) {
    case 'home':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <path
            d="M8 22L24 9L40 22V38C40 40.2 38.2 42 36 42H12C9.8 42 8 40.2 8 38V22Z"
            fill="#FFE49E"
            stroke="#2A114B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M5 23L24 7L43 23"
            stroke="#2A114B"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 21L24 9L39 21"
            stroke="#FF66B5"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="19"
            y="27"
            width="10"
            height="15"
            rx="3"
            fill="#FF66B5"
            stroke="#2A114B"
            strokeWidth="3.2"
          />
        </svg>
      );
    case 'files':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <path
            d="M6 14C6 11.8 7.8 10 10 10H19L23 15H38C40.2 15 42 16.8 42 19V36C42 38.2 40.2 40 38 40H10C7.8 40 6 38.2 6 36V14Z"
            fill="#FFE484"
            stroke="#2A114B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M24 33C24 33 17 28 17 23.5C17 21 19 19.5 21 19.5C22.5 19.5 23.5 20.5 24 21.5C24.5 20.5 25.5 19.5 27 19.5C29 19.5 31 21 31 23.5C31 28 24 33 24 33Z"
            fill="#FF5CAD"
            stroke="#2A114B"
            strokeWidth="2.5"
          />
        </svg>
      );
    case 'apps':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <rect x="8" y="8" width="14" height="14" rx="4" fill="#C77DFF" stroke="#2A114B" strokeWidth="3.5" />
          <rect x="26" y="8" width="14" height="14" rx="4" fill="#FF66B5" stroke="#2A114B" strokeWidth="3.5" />
          <rect x="8" y="26" width="14" height="14" rx="4" fill="#FF66B5" stroke="#2A114B" strokeWidth="3.5" />
          <rect x="26" y="26" width="14" height="14" rx="4" fill="#FFA8D8" stroke="#2A114B" strokeWidth="3.5" />
        </svg>
      );
    case 'ai':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <path
            d="M22 6C23.8 16 28 20.2 38 22C28 23.8 23.8 28 22 38C20.2 28 16 23.8 6 22C16 20.2 20.2 16 22 6Z"
            fill="#FF85C8"
            stroke="#2A114B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M37 6C37.8 10 39.5 11.7 43.5 12.5C39.5 13.3 37.8 15 37 19C36.2 15 34.5 13.3 30.5 12.5C34.5 11.7 36.2 10 37 6Z"
            fill="#FFE47A"
            stroke="#2A114B"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'agents':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <line x1="24" y1="6" x2="24" y2="14" stroke="#2A114B" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="24" cy="6" r="3.5" fill="#FF66B5" stroke="#2A114B" strokeWidth="2.8" />
          <rect x="9" y="14" width="30" height="24" rx="10" fill="#C77DFF" stroke="#2A114B" strokeWidth="3.5" />
          <rect x="4" y="21" width="5" height="10" rx="2.5" fill="#FF66B5" stroke="#2A114B" strokeWidth="3" />
          <rect x="39" y="21" width="5" height="10" rx="2.5" fill="#FF66B5" stroke="#2A114B" strokeWidth="3" />
          {/* Cute heart eyes */}
          <circle cx="18" cy="25" r="3" fill="#2A114B" />
          <circle cx="30" cy="25" r="3" fill="#2A114B" />
          <path d="M20 32C21.5 33.5 26.5 33.5 28 32" stroke="#2A114B" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'models':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <path d="M24 8L42 17L24 26L6 17L24 8Z" fill="#FF85C8" stroke="#2A114B" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M6 25L24 34L42 25" stroke="#2A114B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 32L24 41L42 32" stroke="#2A114B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'memory':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <path
            d="M8 12C14 10 20 11 24 14C28 11 34 10 40 12V36C34 34 28 35 24 38C20 35 14 34 8 36V12Z"
            fill="#FFA8D8"
            stroke="#2A114B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <line x1="24" y1="14" x2="24" y2="38" stroke="#2A114B" strokeWidth="3.5" />
          <path d="M13 19H19M13 25H19M29 19H35M29 25H35" stroke="#2A114B" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <path
            d="M20 7H28L29.5 12.2C31 12.8 32.4 13.6 33.6 14.6L38.8 13L42.8 20L38.8 23.8C39 24.8 39 25.8 38.8 26.8L42.8 30.6L38.8 37.6L33.6 36C32.4 37 31 37.8 29.5 38.4L28 43H20L18.5 38.4C17 37.8 15.6 37 14.4 36L9.2 37.6L5.2 30.6L9.2 26.8C9 25.8 9 24.8 9.2 23.8L5.2 20L9.2 13L14.4 14.6C15.6 13.6 17 12.8 18.5 12.2L20 7Z"
            fill="#C77DFF"
            stroke="#2A114B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="25" r="6.5" fill="#FFF6E8" stroke="#2A114B" strokeWidth="3.5" />
        </svg>
      );
    case 'terminal':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <rect x="6" y="8" width="36" height="32" rx="8" fill="#8A4FFF" stroke="#2A114B" strokeWidth="3.5" />
          <path d="M14 19L21 24L14 29M24 30H33" stroke="#FFF8F0" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="16" fill="#C77DFF" stroke="#2A114B" strokeWidth="3.5" />
          <ellipse cx="24" cy="24" rx="8" ry="16" stroke="#2A114B" strokeWidth="3" />
          <line x1="8" y1="24" x2="40" y2="24" stroke="#2A114B" strokeWidth="3" />
        </svg>
      );
    case 'gallery':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <rect x="6" y="8" width="36" height="32" rx="8" fill="#D8A8FF" stroke="#2A114B" strokeWidth="3.5" />
          <circle cx="17" cy="18" r="3.5" fill="#FFE47A" stroke="#2A114B" strokeWidth="2.5" />
          <path d="M8 34L18 24L26 31L33 25L40 34V36C40 38.2 38.2 40 36 40H12C9.8 40 8 38.2 8 36V34Z" fill="#FF5CAD" stroke="#2A114B" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
    case 'music':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <path d="M20 35V13L38 9V31" stroke="#2A114B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="15" cy="35" r="6" fill="#FF66B5" stroke="#2A114B" strokeWidth="3.5" />
          <circle cx="33" cy="31" r="6" fill="#C77DFF" stroke="#2A114B" strokeWidth="3.5" />
        </svg>
      );
    case 'play':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <rect x="6" y="8" width="36" height="32" rx="8" fill="#FF5CAD" stroke="#2A114B" strokeWidth="3.5" />
          <path d="M20 16L32 24L20 32V16Z" fill="#FFF8F0" stroke="#2A114B" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
  }
}

// Desktop Illustrated Background Canvas (Moon, Clouds, Stars, City Silhouette, Sakura Flowers)
export function DesktopBackdropArtwork({ wallpaper }: { wallpaper: WallpaperScene }) {
  const skyGradient =
    wallpaper === 'twilight-clouds'
      ? 'from-[#6425B8] via-[#A44CD8] to-[#FF7CC3]'
      : wallpaper === 'sakura-starlight'
      ? 'from-[#48168A] via-[#8338EC] to-[#FF5CAD]'
      : 'from-[#240B4C] via-[#531CB3] to-[#9B5DE5]';

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden bg-gradient-to-b ${skyGradient} z-0`}>
      {/* Soft glowing clouds */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-95"
      >
        {/* Top dark purple sky arch */}
        <path
          d="M0 0H1440V220C1200 180 960 90 720 110C480 130 220 190 0 150V0Z"
          fill="#4A158B"
          opacity="0.55"
        />

        {/* Dreamy Cream Clouds Behind Window */}
        <g stroke="#2A114B" strokeWidth="4" fill="#FFF7EB">
          <path d="M180 190C185 145 230 120 275 135C305 95 375 95 405 140C445 135 480 165 480 205H180Z" />
          <path d="M770 155C780 115 830 95 870 118C905 85 965 92 988 135C1025 132 1055 160 1055 195H770Z" />
        </g>

        {/* Pink & Lavender Layered Clouds */}
        <path
          d="M1150 280C1180 220 1260 205 1315 245C1355 210 1415 225 1440 270V620H1100L1150 280Z"
          fill="#FF77C8"
          stroke="#2A114B"
          strokeWidth="4"
        />
        <path
          d="M1180 420C1220 370 1300 365 1350 405C1390 385 1420 400 1440 430V780H1120L1180 420Z"
          fill="#B65CFF"
          stroke="#2A114B"
          strokeWidth="4"
        />

        {/* Crescent Moon at Top Center */}
        <g transform="translate(575, 16)">
          <path
            d="M72 12C40 16 18 46 22 80C26 114 58 138 92 132C112 128 128 116 136 98C114 106 88 96 78 74C68 52 76 26 94 14C87 12 79 11 72 12Z"
            fill="#FFE26A"
            stroke="#2A114B"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
        </g>

        {/* Sparkling Stars */}
        <g stroke="#2A114B" strokeWidth="3.5" strokeLinejoin="round">
          <path
            d="M546 58C548 70 554 76 566 78C554 80 548 86 546 98C544 86 538 80 526 78C538 76 544 70 546 58Z"
            fill="#FFE47A"
          />
          <path
            d="M786 62C788 74 794 80 806 82C794 84 788 90 786 102C784 90 778 84 766 82C778 80 784 74 786 62Z"
            fill="#FFF6E8"
          />
          <path
            d="M1355 82L1365 104L1389 107L1371 124L1376 148L1355 136L1334 148L1339 124L1321 107L1345 104L1355 82Z"
            fill="#FFE47A"
            strokeWidth="4"
          />
          <path
            d="M1365 190C1368 206 1376 214 1392 217C1376 220 1368 228 1365 244C1362 228 1354 220 1338 217C1354 214 1362 206 1365 190Z"
            fill="#FFE47A"
          />
          <path
            d="M1345 360C1347 372 1353 378 1365 380C1353 382 1347 388 1345 400C1343 388 1337 382 1325 380C1337 378 1343 372 1345 360Z"
            fill="#FFF6E8"
          />
        </g>

        {/* Right-side City Silhouette */}
        <g transform="translate(1295, 510)">
          <path
            d="M40 90L48 10L56 90H85V190H10V90H40Z"
            fill="#5E239D"
            stroke="#2A114B"
            strokeWidth="3.5"
          />
          <rect x="26" y="110" width="12" height="16" rx="2" fill="#FFE47A" />
          <rect x="52" y="110" width="12" height="16" rx="2" fill="#FFE47A" />
          <rect x="26" y="140" width="12" height="16" rx="2" fill="#FFE47A" />
          <rect x="52" y="140" width="12" height="16" rx="2" fill="#FFE47A" />
          <rect x="92" y="130" width="55" height="90" fill="#46127D" stroke="#2A114B" strokeWidth="3.5" />
          <rect x="106" y="150" width="12" height="16" rx="2" fill="#FFE47A" />
        </g>

        {/* Bottom Left Sakura Cherry Blossom */}
        <g transform="translate(-10, 725)">
          <path
            d="M180 130C215 115 245 130 265 160C225 175 195 165 180 130Z"
            fill="#62259E"
            stroke="#2A114B"
            strokeWidth="4"
          />
          <path
            d="M105 90C80 40 135 15 155 60C185 20 235 55 195 100C240 120 215 175 165 155C150 200 90 185 100 135C50 130 60 75 105 90Z"
            fill="#FF66B5"
            stroke="#2A114B"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <circle cx="150" cy="115" r="14" fill="#FFE47A" stroke="#2A114B" strokeWidth="3.5" />
        </g>

        {/* Bottom Right Sakura Cherry Blossom */}
        <g transform="translate(1195, 690)">
          <path
            d="M70 155C30 140 5 155 -15 185C25 200 55 190 70 155Z"
            fill="#62259E"
            stroke="#2A114B"
            strokeWidth="4"
          />
          <path
            d="M115 95C95 45 150 20 170 65C200 25 250 60 210 105C255 125 230 180 180 160C165 205 105 190 115 140C65 135 75 80 115 95Z"
            fill="#C77DFF"
            stroke="#2A114B"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <circle cx="165" cy="120" r="14" fill="#FFE47A" stroke="#2A114B" strokeWidth="3.5" />
        </g>
      </svg>
    </div>
  );
}
