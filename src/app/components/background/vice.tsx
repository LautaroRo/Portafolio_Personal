import "./vice.css";

// Atardecer en Vice City hecho con CSS y SVG: cielo, sol retro, skyline, mar y palmeras.
// Cero descargas: pesa menos que un fotograma de video.

const VENTANAS = [
  [6, 58], [9, 50], [14, 62], [19, 44], [23, 55], [31, 40], [34, 52], [41, 47],
  [47, 36], [52, 49], [58, 42], [63, 53], [69, 38], [74, 50], [81, 45], [87, 56], [92, 48],
];

const Palmera = ({ className }: { className: string }) => (
  <svg className={`vice-palm ${className}`} viewBox="0 0 200 420" aria-hidden>
    <path d="M96 420 C100 330 112 240 104 150 L114 150 C124 240 116 330 112 420 Z" />
    <g className="vice-fronds">
      <path d="M108 152 C80 120 40 112 4 128 C40 124 72 134 104 160 Z" />
      <path d="M108 152 C140 116 180 112 200 124 C170 122 140 134 112 160 Z" />
      <path d="M108 152 C88 104 60 82 26 76 C60 92 84 116 102 158 Z" />
      <path d="M108 152 C128 100 158 80 190 78 C158 94 132 118 114 158 Z" />
      <path d="M108 152 C104 108 112 72 134 44 C120 80 116 112 112 156 Z" />
      <path d="M108 152 C70 150 40 168 22 196 C46 176 76 166 104 162 Z" />
      <path d="M108 152 C146 150 172 168 186 196 C164 176 136 166 112 162 Z" />
    </g>
  </svg>
);

export default function ViceScene() {
  return (
    <div className="vice-bg" aria-hidden>
      <div className="vice-stars" />
      <div className="vice-sun" />

      <svg className="vice-skyline" viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d="M0 60 V48 H3 V40 H6 V52 H8 V34 H11 V46 H13 V30 H15 V26 H17 V30 H19 V42 H22 V36 H25 V50 H27 V28 H30 V22 H31 V18 H32 V22 H33 V28 H36 V44 H39 V32 H43 V40 H45 V24 H47 V14 H48 V24 H50 V38 H53 V30 H57 V46 H60 V26 H63 V34 H66 V20 H67 V12 H68 V20 H70 V36 H73 V44 H76 V30 H79 V40 H82 V28 H85 V48 H88 V36 H91 V44 H94 V32 H97 V50 H100 V60 Z" />
        {VENTANAS.map(([x, y], i) => (
          <rect key={i} className="vice-window" x={x} y={y} width="0.8" height="1.2" style={{ animationDelay: `${(i * 0.7) % 5}s` }} />
        ))}
      </svg>

      <div className="vice-sea">
        <div className="vice-reflection" />
        <div className="vice-waves" />
      </div>

      <Palmera className="vice-palm--left" />
      <Palmera className="vice-palm--right" />
    </div>
  );
}
