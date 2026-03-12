import React from 'react';
import { calculateAverageCycleLength, calculateAverageDuration, getShortestCycle, getLongestCycle, getDaysBetween, getTodayISO } from '../utils';

export function CyclePhaseWheel({ cycles }) {
  if (!cycles || cycles.length < 1) return null;

  const avgCycleLength = calculateAverageCycleLength(cycles);
  const avgDuration    = calculateAverageDuration(cycles);

  const sorted     = [...cycles].sort((a, b) => a.date.localeCompare(b.date));
  const lastPeriod = sorted[sorted.length - 1];
  const cycleDay   = getDaysBetween(lastPeriod.date, getTodayISO()) + 1;
  const clampedDay = Math.max(1, Math.min(cycleDay, avgCycleLength));

  // Phase ranges
  const phases = [
    { name: 'Menstrual',   start: 1,                end: avgDuration,       color: '#f43f5e', label: 'Menstrual' },
    { name: 'Follicular',  start: avgDuration + 1,  end: 12,                color: '#f59e0b', label: 'Follicular' },
    { name: 'Ovulation',   start: 13,               end: 16,                color: '#14b8a6', label: 'Ovulation' },
    { name: 'Luteal',      start: 17,               end: avgCycleLength,    color: '#8b5cf6', label: 'Luteal' },
  ];

  let currentPhase = phases[phases.length - 1];
  for (const p of phases) {
    if (clampedDay >= p.start && clampedDay <= p.end) { currentPhase = p; break; }
  }

  // SVG arc helper
  const CX = 100, CY = 100, R = 80, STROKE = 22;

  function polarToXY(angleDeg, r) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  }

  function describeArc(startDeg, endDeg) {
    const s = polarToXY(startDeg, R);
    const e = polarToXY(endDeg, R);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  // Build arc segments
  const totalDays = avgCycleLength;
  function dayToAngle(day) { return ((day - 1) / totalDays) * 360; }

  const dotAngle = dayToAngle(clampedDay);
  const dotPos   = polarToXY(dotAngle, R);

  const arcSegments = phases.map(p => ({
    ...p,
    startAngle: dayToAngle(p.start),
    endAngle:   dayToAngle(Math.min(p.end, totalDays)) + (360 / totalDays),
  }));

  const Row = ({ label, value, unit = 'days' }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-700 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm text-slate-100">{value}{value !== null ? ' ' + unit : ''}</span>
    </div>
  );

  const avg      = cycles.length >= 2 ? calculateAverageCycleLength(cycles) : null;
  const shortest = cycles.length >= 2 ? getShortestCycle(cycles) : null;
  const longest  = cycles.length >= 2 ? getLongestCycle(cycles) : null;

  return (
    <section className="mx-4 mt-4 p-4 glass rounded-xl anim-fade-in-up">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Cycle Phase</p>
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#1e293b" strokeWidth={STROKE} />
          {arcSegments.map((seg, i) => (
            <path
              key={i}
              d={describeArc(seg.startAngle, seg.endAngle - 0.5)}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              opacity={seg.name === currentPhase.name ? '1' : '0.3'}
            />
          ))}
          <circle cx={dotPos.x} cy={dotPos.y} r="8" fill="white" stroke="#0f172a" strokeWidth="2" />
          <text x={CX} y={CY - 10} textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="system-ui,sans-serif">Day {clampedDay}</text>
          <text x={CX} y={CY + 10} textAnchor="middle" fontSize="15" fill="white" fontWeight="600" fontFamily="system-ui,sans-serif">{currentPhase.label}</text>
        </svg>
        <div className="flex gap-3 flex-wrap justify-center mb-3">
          {phases.map((p, i) => (
            <div key={i} className="flex items-center gap-1">
              <span style={{ width:10, height:10, borderRadius:'50%', background:p.color, display:'inline-block', opacity: p.name === currentPhase.name ? 1 : 0.4 }}></span>
              <span className="text-xs text-slate-400" style={p.name === currentPhase.name ? {color:'white', fontWeight:600} : {}}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
      {cycles.length >= 2 && (
        <div className="mt-1">
          <Row label="Average length" value={avg} />
          <Row label="Shortest cycle" value={shortest} />
          <Row label="Longest cycle" value={longest} />
          <Row label="Average period" value={avgDuration} />
        </div>
      )}
    </section>
  );
}
