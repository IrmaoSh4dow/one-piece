import type { ReactNode } from 'react'

const STARS = [
  { top: '8%', left: '7%', delay: '0s', size: 2 },
  { top: '14%', left: '22%', delay: '1.2s', size: 3 },
  { top: '6%', left: '48%', delay: '0.4s', size: 2 },
  { top: '18%', left: '73%', delay: '1.8s', size: 2 },
  { top: '11%', left: '88%', delay: '0.8s', size: 3 },
  { top: '72%', left: '12%', delay: '1.5s', size: 2 },
  { top: '80%', left: '84%', delay: '0.2s', size: 2 },
  { top: '64%', left: '92%', delay: '1.1s', size: 3 },
]

export function MapScene({ children }: { children: ReactNode }) {
  return (
    <div className="sea">
      <div className="sea-art" aria-hidden="true">
        <svg className="map-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="isle" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#d8c09a" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#d8c09a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M80 140 C 220 80, 340 210, 460 150 S 690 60, 820 160 1040 120 1140 210"
            fill="none"
            stroke="#c6a56a"
            strokeWidth="1.4"
            strokeDasharray="7 10"
            opacity="0.45"
          />
          <path
            d="M120 620 C 280 540, 390 700, 560 610 S 860 520, 1080 640"
            fill="none"
            stroke="#c6a56a"
            strokeWidth="1.2"
            strokeDasharray="5 9"
            opacity="0.35"
          />
          <ellipse cx="250" cy="230" rx="120" ry="54" fill="url(#isle)" />
          <ellipse cx="860" cy="180" rx="150" ry="62" fill="url(#isle)" />
          <ellipse cx="640" cy="560" rx="180" ry="70" fill="url(#isle)" />
          <ellipse cx="180" cy="640" rx="90" ry="40" fill="url(#isle)" />
          <g transform="translate(980 560)" opacity="0.55" fill="none" stroke="#e6d3ad" strokeWidth="1.4">
            <circle r="72" />
            <circle r="46" />
            <path d="M0 -78 V78 M-78 0 H78 M-52 -52 L52 52 M-52 52 L52 -52" />
            <polygon points="0,-78 10,-18 -10,-18" fill="#e6d3ad" stroke="none" />
          </g>
          <g transform="translate(70 430)" fill="#e7c2c6" opacity="0.55">
            <path d="M0 5 C -6 -4 -16 -1 -16 6 C -16 14 0 20 0 26 C 0 20 16 14 16 6 C 16 -1 6 -4 0 5 Z" />
          </g>
          <g transform="translate(1088 690) scale(0.7)" fill="#e7c2c6" opacity="0.45">
            <path d="M0 5 C -6 -4 -16 -1 -16 6 C -16 14 0 20 0 26 C 0 20 16 14 16 6 C 16 -1 6 -4 0 5 Z" />
          </g>
        </svg>
        {STARS.map((star) => (
          <span
            key={`${star.top}-${star.left}`}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
      <div className="shell">{children}</div>
    </div>
  )
}
