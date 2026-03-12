import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePetState } from '../hooks/usePetState';
import { getNextExpectedDate, getDaysUntil } from '../utils';

/* ────────────────────────────────────────────────────
   Luna Moon Character — Clean SVG
   Based on the AI sprite renders: warm crescent body,
   dot eyes, curved smile, stubby arms, small feet.
   All shapes use smooth bezier curves + gradients.
──────────────────────────────────────────────────── */
function LunaSVG({ mood = 'idle', size = 88 }) {
  // Mood helpers
  const sleeping  = mood === 'sleep';
  const happy     = mood === 'happy' || mood === 'dance';
  const surprised = mood === 'surprised';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* Warm radial gradient — bright ivory centre, golden edge */}
        <radialGradient id="moonBody" cx="45%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#fffde7" />
          <stop offset="55%"  stopColor="#fff9c4" />
          <stop offset="100%" stopColor="#ffe57f" />
        </radialGradient>

        {/* Soft inner shadow for depth on concave side */}
        <radialGradient id="moonShade" cx="75%" cy="30%" r="50%">
          <stop offset="0%"   stopColor="rgba(200,160,0,0.18)" />
          <stop offset="100%" stopColor="rgba(200,160,0,0)" />
        </radialGradient>

        {/* Crescent mask: big circle minus offset inner circle */}
        <mask id="crescent">
          <rect width="100" height="100" fill="white" />
          <circle cx="66" cy="30" r="33" fill="black" />
        </mask>

        {/* Soft drop-shadow filter */}
        <filter id="lunaGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
          <feFlood floodColor="#ffe57f" floodOpacity="0.5" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="colorBlur" />
          <feMerge>
            <feMergeNode in="colorBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Body ── */}
      <g filter="url(#lunaGlow)">
        {/* Main crescent */}
        <circle
          cx="40" cy="52" r="36"
          fill="url(#moonBody)"
          mask="url(#crescent)"
        />
        {/* Depth shading */}
        <circle
          cx="40" cy="52" r="36"
          fill="url(#moonShade)"
          mask="url(#crescent)"
        />
      </g>

      {/* ── Eyes ── */}
      {sleeping ? (
        // Closed: two small horizontal lines
        <>
          <line x1="29" y1="50" x2="36" y2="50" stroke="#2d1a5e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="42" y1="50" x2="49" y2="50" stroke="#2d1a5e" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : happy ? (
        // Happy: curved upward arcs
        <>
          <path d="M29 52 Q32.5 48 36 52" stroke="#2d1a5e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M42 52 Q45.5 48 49 52" stroke="#2d1a5e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      ) : surprised ? (
        // Wide open circles
        <>
          <circle cx="32" cy="51" r="4.5" fill="#2d1a5e" />
          <circle cx="46" cy="51" r="4.5" fill="#2d1a5e" />
          <circle cx="30.5" cy="49.5" r="1.2" fill="white" />
          <circle cx="44.5" cy="49.5" r="1.2" fill="white" />
        </>
      ) : (
        // Normal: dots
        <>
          <circle cx="32" cy="51" r="3.2" fill="#2d1a5e" />
          <circle cx="46" cy="51" r="3.2" fill="#2d1a5e" />
          {/* Tiny specular highlights */}
          <circle cx="30.8" cy="49.8" r="1" fill="white" />
          <circle cx="44.8" cy="49.8" r="1" fill="white" />
        </>
      )}

      {/* ── Mouth ── */}
      {!sleeping && (
        happy ? (
          <path d="M30 59 Q39 66 48 59" stroke="#2d1a5e" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : surprised ? (
          <ellipse cx="39" cy="61" rx="4" ry="5" fill="#2d1a5e" />
        ) : (
          <path d="M33 59 Q39 63 45 59" stroke="#2d1a5e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )
      )}

      {/* ── Blush (happy only) ── */}
      {happy && (
        <>
          <ellipse cx="24" cy="57" rx="6" ry="4" fill="rgba(255,100,130,0.22)" />
          <ellipse cx="54" cy="57" rx="6" ry="4" fill="rgba(255,100,130,0.22)" />
        </>
      )}

      {/* ── Arms ── */}
      {!sleeping ? (
        happy ? (
          // Arms up and out in joy
          <>
            <path d="M12 46 Q8 38 14 32" stroke="#ffe082" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M62 38 Q70 30 68 22" stroke="#ffe082" strokeWidth="5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          // Arms resting down
          <>
            <path d="M12 54 Q6 58 8 65" stroke="#ffe082" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M62 54 Q70 58 68 65" stroke="#ffe082" strokeWidth="5" fill="none" strokeLinecap="round" />
          </>
        )
      ) : (
        // Sleep: arms folded (short stubs)
        <>
          <path d="M12 58 Q8 62 10 66" stroke="#ffe082" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M60 60 Q66 64 64 68" stroke="#ffe082" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* ── Feet ── */}
      <ellipse cx="30" cy="86" rx="8" ry="5" fill="#ffe082" />
      <ellipse cx="48" cy="86" rx="8" ry="5" fill="#ffe082" />
      {/* Toe bumps */}
      <circle cx="25" cy="85" r="3" fill="#ffe082" />
      <circle cx="31" cy="84" r="3.5" fill="#ffe082" />
      <circle cx="37" cy="85" r="3" fill="#ffe082" />
      <circle cx="43" cy="85" r="3" fill="#ffe082" />
      <circle cx="49" cy="84" r="3.5" fill="#ffe082" />
      <circle cx="55" cy="85" r="3" fill="#ffe082" />

      {/* ── Sleep Z ── */}
      {sleeping && (
        <text
          x="68" y="34" fontSize="14" fontWeight="800" fill="rgba(180,180,255,0.9)"
          fontFamily="monospace"
          style={{ animation: 'petZzz 2s ease-in-out infinite' }}
        >z</text>
      )}
    </svg>
  );
}

/* ── Messages ────────────────────────────────────── */
const GREET = ['oh you\'re here! 🌙','hi hi hi!! ✨','you look nice today 💗','wanna play? 🌙','today feels good 🌸','glowing for you ✨','hi bestie 👋','*happy shimmer* 🌟'];
const PHASE_MSG = {
  Menstrual:  ['rest easy 🌙','cozy mode on 🫂'],
  Follicular: ['fresh energy ⚡','new beginnings 🌱'],
  Ovulation:  ['you\'re glowing! ✨','peak power 💫'],
  Luteal:     ['chocolate is valid 🍫','cozy season 🧸'],
};
const PHASE_ACC = { Menstrual:'☕', Follicular:'🌱', Ovulation:'✨', Luteal:'🌙' };
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

const ANIM = {
  idle: 'luna-idle', happy: 'luna-bounce', sleep: 'luna-sleep',
  dance: 'luna-dance', surprised: 'luna-surprised', walk: 'luna-walk-bob',
};

/* ── Main Pet Component ─────────────────────────── */
export function Pet({ currentPhase = 'Follicular', cycles = [] }) {
  const { happiness, mood: hmood, tap } = usePetState(cycles);
  const [anim,    setAnim]    = useState('idle');
  const [walkDir, setWalkDir] = useState(1);
  const [posX,    setPosX]    = useState(48);
  const [bubble,  setBubble]  = useState(null);
  const [tapN,    setTapN]    = useState(0);

  const animRef  = useRef('idle');
  const timerRef = useRef(null);
  const bubRef   = useRef(null);

  useEffect(() => { animRef.current = anim; }, [anim]);

  const say = useCallback((text, ms = 4000) => {
    clearTimeout(bubRef.current);
    setBubble({ text, key: Date.now() });
    bubRef.current = setTimeout(() => setBubble(null), ms);
  }, []);

  const once = useCallback((a, ms) => {
    setAnim(a);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAnim('idle'), ms);
  }, []);

  /* Wandering */
  useEffect(() => {
    function walk() {
      if (animRef.current !== 'idle') { timerRef.current = setTimeout(walk, 4000); return; }
      const dir = Math.random() > 0.5 ? 1 : -1;
      const dist = 12 + Math.random() * 24;
      setWalkDir(dir);
      setAnim('walk');
      setPosX(p => Math.min(80, Math.max(8, p + dir * dist)));
      setTimeout(() => {
        setAnim('idle');
        timerRef.current = setTimeout(walk, 14000 + Math.random() * 16000);
      }, 2400);
    }
    timerRef.current = setTimeout(walk, 5000 + Math.random() * 8000);
    return () => clearTimeout(timerRef.current);
  }, []);

  /* Auto mood */
  useEffect(() => {
    if (anim !== 'idle') return;
    const h = new Date().getHours();
    if (hmood === 'sleepy' || h >= 22 || h < 6) { setAnim('sleep'); return; }
    if (hmood === 'ecstatic') setAnim('happy');
  }, [hmood, anim]);

  /* Cycle logged */
  useEffect(() => {
    const fn = () => { once('happy', 3000); say('moon log! 🌙✨', 3200); };
    window.addEventListener('luna:periodLogged', fn);
    return () => window.removeEventListener('luna:periodLogged', fn);
  }, [once, say]);

  /* Idle message */
  useEffect(() => {
    if (anim !== 'idle') return;
    const t = setTimeout(() => {
      say(Math.random() > 0.4 ? pick(PHASE_MSG[currentPhase] || GREET) : pick(GREET));
    }, 10000 + Math.random() * 14000);
    return () => clearTimeout(t);
  }, [anim, currentPhase, say]);

  /* Period hint */
  useEffect(() => {
    if (!cycles.length) return;
    const next = getNextExpectedDate(cycles);
    if (!next) return;
    const d = getDaysUntil(next);
    if (d === 2) setTimeout(() => say('cycle coming soon 🌙', 5000), 3000);
    if (d === 0) setTimeout(() => say('day one! you got this 💗', 5000), 2000);
  }, [cycles, say]);

  /* Tap */
  const onTap = useCallback(() => {
    tap();
    const n = tapN + 1;
    setTapN(n);
    setTimeout(() => setTapN(x => Math.max(0, x - 1)), 1600);
    if (n >= 5) { once('surprised', 900); say('dizzy! 🌀', 1200); return; }
    pick([
      () => { once('happy', 1800); say(pick(GREET)); },
      () => { once('happy', 2000); say('wheee! 💫'); },
      () => { once('surprised', 700); say('oh! hi! 👀'); },
      () => say(pick(PHASE_MSG[currentPhase] || GREET)),
      () => { once('happy', 1500); say('*sparkles* ✨'); },
    ])();
  }, [tap, tapN, once, say, currentPhase]);

  const svgMood = anim === 'dance' ? 'happy'
                : anim === 'walk'  ? 'idle'
                : anim;

  const cssAnim  = ANIM[anim] || 'luna-idle';
  const isFlipX  = anim === 'walk' && walkDir < 0;

  return (
    <div style={{ position:'fixed', bottom:0, left:0, width:'100%', height:130, pointerEvents:'none', zIndex:50 }}>
      <div
        onClick={onTap}
        style={{
          position:'absolute', bottom:4,
          left:`${posX}%`, transform:'translateX(-50%)',
          cursor:'pointer', pointerEvents:'auto', userSelect:'none',
          display:'flex', flexDirection:'column', alignItems:'center', gap:2,
          transition: anim === 'walk' ? 'left 2.3s linear' : 'left 0.5s ease-out',
        }}
      >
        {/* Bubble */}
        {bubble && (
          <div key={bubble.key} style={{
            position:'absolute', bottom:104,
            left:'50%', transform:'translateX(-50%)',
            whiteSpace:'nowrap', padding:'5px 12px', borderRadius:16,
            fontSize:11, fontWeight:600,
            background:'var(--luna-glass-bg)', backdropFilter:'blur(12px)',
            border:'1px solid var(--luna-glass-border)', color:'var(--luna-text-1)',
            boxShadow:'0 4px 12px rgba(0,0,0,0.15)',
            animation:'petBubble 0.22s ease-out', pointerEvents:'none',
          }}>
            {bubble.text}
            <span style={{
              position:'absolute', bottom:-5, left:'50%', transform:'translateX(-50%)',
              width:0, height:0,
              borderLeft:'5px solid transparent', borderRight:'5px solid transparent',
              borderTop:'6px solid var(--luna-glass-border)',
            }}/>
          </div>
        )}

        {/* Accessory */}
        <div style={{ fontSize:13, animation:'petFloat 2.5s ease-in-out infinite', lineHeight:1 }}>
          {PHASE_ACC[currentPhase]}
        </div>

        {/* Luna character */}
        <div
          className={cssAnim}
          style={{ transform: isFlipX ? 'scaleX(-1)' : undefined, transformOrigin:'center bottom' }}
        >
          <LunaSVG mood={svgMood} size={88} />
        </div>

        {/* Hearts */}
        <div style={{ display:'flex', gap:3, fontSize:8, lineHeight:1 }}>
          {[0,1,2,3,4].map(i => (
            <span key={i} style={{
              color: i < Math.round(happiness/20) ? '#f43f5e' : 'rgba(150,150,150,0.3)',
              transition:'color 0.5s',
            }}>♥</span>
          ))}
        </div>
      </div>
    </div>
  );
}
