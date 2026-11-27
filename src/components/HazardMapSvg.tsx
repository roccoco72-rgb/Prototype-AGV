import { useState } from 'react';
import { Layers } from 'lucide-react';

export function HazardMapSvg() {
  const [showHq100, setShowHq100] = useState(true);
  const [showRunoff, setShowRunoff] = useState(true);
  const [showParcel, setShowParcel] = useState(true);

  return (
    <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-50">
      {/* Map Header & Layer Toggles */}
      <div className="px-3.5 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <Layers className="w-3.5 h-3.5 text-[#00A3E0]" aria-hidden="true" />
          <span>AGIS Gefahrenkarte — Windisch / Reuss</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => setShowHq100((v) => !v)}
            className={`px-2 py-1 rounded border transition-colors whitespace-nowrap ${
              showHq100
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            Zone HQ100
          </button>
          <button
            type="button"
            onClick={() => setShowRunoff((v) => !v)}
            className={`px-2 py-1 rounded border transition-colors whitespace-nowrap ${
              showRunoff
                ? 'bg-sky-50 border-sky-300 text-sky-900 font-medium'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            Starkregen
          </button>
          <button
            type="button"
            onClick={() => setShowParcel((v) => !v)}
            className={`px-2 py-1 rounded border transition-colors whitespace-nowrap ${
              showParcel
                ? 'bg-[#003366]/10 border-[#003366]/30 text-[#003366] font-medium'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            Parzelle 672
          </button>
        </div>
      </div>

      {/* Crisp Architectural GIS Schematic SVG */}
      <div className="relative">
        <svg
          viewBox="0 0 540 240"
          className="w-full h-auto block"
          role="img"
          aria-label="Kantonale Gefahrenkarte Windisch an der Reuss: Parzelle GB-Nr. 672 in Hochwasser-Gefahrenzone 2 (HQ100) mit 0.42 m Überflutungstiefe"
        >
          {/* Base topographic grid */}
          <rect width="540" height="240" fill="#F8FAFC" />
          <g stroke="#E2E8F0" strokeWidth="0.75">
            <line x1="0" y1="60" x2="540" y2="60" />
            <line x1="0" y1="120" x2="540" y2="120" />
            <line x1="0" y1="180" x2="540" y2="180" />
            <line x1="90" y1="0" x2="90" y2="240" />
            <line x1="180" y1="0" x2="180" y2="240" />
            <line x1="270" y1="0" x2="270" y2="240" />
            <line x1="360" y1="0" x2="360" y2="240" />
            <line x1="450" y1="0" x2="450" y2="240" />
          </g>

          {/* Industriestrasse road */}
          <path
            d="M 0 198 L 540 182"
            stroke="#CBD5E1"
            strokeWidth="12"
            fill="none"
          />
          <text
            x="22"
            y="196"
            fill="#475569"
            fontSize="9"
            fontFamily="DM Sans, sans-serif"
            fontWeight="600"
          >
            Industriestrasse
          </text>

          {/* HQ100 Hazard Zone Yellow (moderate/low) */}
          {showHq100 && (
            <path
              d="M 0 38 C 110 48, 220 74, 340 86 C 430 95, 490 88, 540 82 L 540 165 C 450 172, 340 170, 230 158 C 130 148, 60 132, 0 128 Z"
              fill="#FDE047"
              fillOpacity="0.34"
              stroke="#CA8A04"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
          )}

          {/* HQ100 Hazard Zone Blue (medium hazard — Zone 2) */}
          {showHq100 && (
            <path
              d="M 0 28 C 120 38, 235 60, 355 70 C 435 76, 495 70, 540 64 L 540 132 C 455 138, 350 134, 245 122 C 145 110, 65 96, 0 92 Z"
              fill="#38BDF8"
              fillOpacity="0.32"
              stroke="#0284C7"
              strokeWidth="1.2"
            />
          )}

          {/* River Reuss */}
          <path
            d="M 0 12 C 130 22, 260 44, 380 48 C 450 50, 500 44, 540 38 L 540 72 C 490 78, 435 80, 365 76 C 245 68, 125 46, 0 38 Z"
            fill="#0284C7"
            fillOpacity="0.72"
          />
          <text
            x="38"
            y="31"
            fill="#FFFFFF"
            fontSize="10"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fontWeight="700"
            letterSpacing="0.06em"
          >
            REUSS (FLIESSRICHTUNG NORD)
          </text>

          {/* Surface runoff arrows */}
          {showRunoff && (
            <g stroke="#0369A1" strokeWidth="1.4" fill="none" strokeLinecap="round">
              <path d="M 190 66 L 204 88 M 198 86 L 204 88 L 206 82" />
              <path d="M 278 74 L 288 98 M 282 95 L 288 98 L 291 92" />
              <path d="M 358 82 L 364 106 M 359 102 L 364 106 L 368 100" />
            </g>
          )}

          {/* Neighboring parcels */}
          <rect
            x="92"
            y="108"
            width="86"
            height="62"
            fill="#FFFFFF"
            fillOpacity="0.65"
            stroke="#94A3B8"
            strokeWidth="1"
          />
          <rect
            x="372"
            y="116"
            width="92"
            height="56"
            fill="#FFFFFF"
            fillOpacity="0.65"
            stroke="#94A3B8"
            strokeWidth="1"
          />

          {/* Target Parcel GB-Nr. 672 + Building Footprint */}
          {showParcel && (
            <g>
              {/* Parcel boundary */}
              <polygon
                points="196,94 352,102 346,174 190,168"
                fill="#FFFFFF"
                fillOpacity="0.45"
                stroke="#003366"
                strokeWidth="2"
              />
              {/* Planned Gewerbehalle & Büros footprint */}
              <rect
                x="212"
                y="108"
                width="120"
                height="50"
                rx="2"
                fill="#003366"
                fillOpacity="0.16"
                stroke="#003366"
                strokeWidth="1.5"
              />
              <text
                x="272"
                y="130"
                textAnchor="middle"
                fill="#003366"
                fontSize="10"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="700"
              >
                Gewerbehalle &amp; Büros
              </text>
              <text
                x="272"
                y="144"
                textAnchor="middle"
                fill="#0F172A"
                fontSize="9"
                fontFamily="IBM Plex Mono, monospace"
              >
                GB-Nr. 672 · EGID 8492019
              </text>

              {/* Water depth callout */}
              <line
                x1="316"
                y1="112"
                x2="386"
                y2="58"
                stroke="#B91C1C"
                strokeWidth="1.25"
              />
              <circle cx="316" cy="112" r="3.5" fill="#B91C1C" />
              <rect
                x="386"
                y="34"
                width="140"
                height="36"
                rx="4"
                fill="#FFFFFF"
                stroke="#DC2626"
                strokeWidth="1.2"
              />
              <text
                x="395"
                y="49"
                fill="#991B1B"
                fontSize="9.5"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="600"
              >
                HQ100: ca. 0.42 m
              </text>
              <text
                x="395"
                y="62"
                fill="#475569"
                fontSize="8.5"
                fontFamily="DM Sans, sans-serif"
              >
                Zone 2 (Blau/Gelb) betroffen
              </text>
            </g>
          )}
        </svg>

        {/* Legend bar */}
        <div className="px-3.5 py-2 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600">
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-sky-400/60 border border-sky-600 inline-block" />
              Mittlere Gefährdung (Blau)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-yellow-300/70 border border-yellow-600 inline-block" />
              Geringe Gefährdung (Gelb)
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">
            LV95: 2&apos;658&apos;412 / 1&apos;259&apos;180
          </span>
        </div>
      </div>
    </div>
  );
}
