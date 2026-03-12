import React, { useState, useEffect } from 'react';

const PET_OPTIONS = [
  { key: 'cat',   emoji: '🐱', sleep: '😴', celebrate: '🥳',
    vibes: { Menstrual:'Rest up, I\'ll purr for you 💗', Follicular:'Feeling frisky! ⚡', Ovulation:'You\'re glowing! ✨', Luteal:'Cuddle time 🧸' }},
  { key: 'dog',   emoji: '🐶', sleep: '😴', celebrate: '🎉',
    vibes: { Menstrual:'I love you! 💗', Follicular:'Walkies time! 🦮', Ovulation:'Fetch! Let\'s go! 🎾', Luteal:'Belly rubs? 🐾' }},
  { key: 'bunny', emoji: '🐰', sleep: '😴', celebrate: '🎊',
    vibes: { Menstrual:'Soft hops 💗', Follicular:'Boing boing! ⚡', Ovulation:'Full of energy! 🌟', Luteal:'Cozy burrow 🏠' }},
  { key: 'fox',   emoji: '🦊', sleep: '😴', celebrate: '🦄',
    vibes: { Menstrual:'Rest, clever one 💗', Follicular:'Scheming… 🤔', Ovulation:'Magnificent! ✨', Luteal:'Twilight walks 🌙' }},
  { key: 'bear',  emoji: '🐻', sleep: '💤', celebrate: '🎈',
    vibes: { Menstrual:'Hibernate time 🌙', Follicular:'Waking up! 🌅', Ovulation:'Strong & fierce! 💪', Luteal:'Honey time 🍯' }},
];

export function Pet({ currentPhase }) {
  const [petKey, setPetKey]       = useState(() => { try { return localStorage.getItem('luna-pet') || 'cat'; } catch { return 'cat'; } });
  const [showPicker, setShowPicker] = useState(false);
  const [petState, setPetState]   = useState('idle');
  const [walkDir, setWalkDir]     = useState('right');
  const [idleX, setIdleX]        = useState(44);
  const [showBubble, setShowBubble] = useState(false);

  const pet = PET_OPTIONS.find(p => p.key === petKey) || PET_OPTIONS[0];

  // Celebrate on period logged
  useEffect(() => {
    const onLogged = () => {
      setPetState('celebrating');
      setShowBubble(true);
      setTimeout(() => { setPetState('idle'); setShowBubble(false); }, 3500);
    };
    window.addEventListener('luna:periodLogged', onLogged);
    return () => window.removeEventListener('luna:periodLogged', onLogged);
  }, []);

  // Bubble timer — show vibe message occasionally when idle
  useEffect(() => {
    if (petState !== 'idle') return;
    const t = setTimeout(() => {
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 3500);
    }, 6000 + Math.random() * 8000);
    return () => clearTimeout(t);
  }, [petState, idleX]);

  // Walk cycle
  useEffect(() => {
    if (petState === 'celebrating') return;
    const doWalk = () => {
      const dir = Math.random() > 0.5 ? 'right' : 'left';
      setWalkDir(dir);
      setPetState('walking');
      setShowBubble(false);
      setTimeout(() => {
        const newX = 20 + Math.random() * 55;
        setIdleX(newX);
        setPetState(currentPhase === 'Menstrual' ? 'sleeping' : 'idle');
        setTimeout(doWalk, 30000 + Math.random() * 50000);
      }, 7000);
    };
    const t = setTimeout(doWalk, 8000 + Math.random() * 10000);
    return () => clearTimeout(t);
  }, [petState, currentPhase]);

  // Build style per state
  const stateStyles = {
    idle:       { position: `left:${idleX}%`, anim: 'petIdle 2.4s ease-in-out infinite', flip: '' },
    sleeping:   { position: 'left:8%',       anim: 'petSleep 3s ease-in-out infinite', flip: '' },
    celebrating:{ position: 'left:42%',      anim: 'petCelebrate 0.55s ease-in-out 6', flip: '' },
    walking:    walkDir === 'right'
      ? { position: 'left:0',  anim: 'petWalk 7s linear forwards',  flip: '' }
      : { position: 'right:0', anim: 'petWalkL 7s linear forwards', flip: 'scaleX(-1)' },
  };
  const s = stateStyles[petState] || stateStyles.idle;

  const displayEmoji = petState === 'sleeping' ? pet.sleep
                     : petState === 'celebrating' ? pet.celebrate
                     : pet.emoji;

  function selectPet(key) {
    setPetKey(key);
    try { localStorage.setItem('luna-pet', key); } catch {}
    setShowPicker(false);
  }

  const bubbleMsg = petState === 'celebrating' ? '🎉 New cycle logged!' : (pet.vibes[currentPhase] || '');

  let dynamicStyle = {};
  if (s.position.startsWith('left')) dynamicStyle.left = s.position.split(':')[1];
  if (s.position.startsWith('right')) dynamicStyle.right = s.position.split(':')[1];
  if (s.flip) dynamicStyle.transform = s.flip;

  return (
    <div style={{ position:'fixed', bottom:0, left:0, width:'100%', pointerEvents:'none', zIndex:50, height:100 }}>
      {/* Pet body */}
      <div
        style={{ position:'absolute', bottom:12, cursor:'pointer', pointerEvents:'auto', ...dynamicStyle }}
        onClick={() => setShowPicker(v => !v)}
      >
        {/* Speech bubble */}
        {showBubble && bubbleMsg ? (
          <>
            <div className="pet-bubble" style={{ position:'absolute', bottom:72, left:'50%', transform:'translateX(-50%)', whiteSpace:'nowrap', padding:'6px 12px', borderRadius:20, fontSize:12, color:'white', pointerEvents:'none' }}>
              {bubbleMsg}
            </div>
            <div style={{ position:'absolute', bottom:68, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'5px solid transparent', borderRight:'5px solid transparent', borderTop:'7px solid rgba(15,23,42,0.88)' }}></div>
          </>
        ) : null}

        {/* Pet emoji in glowing bubble */}
        <div style={{ fontSize:52, lineHeight:1, filter:'drop-shadow(0 0 12px rgba(244,63,94,0.5))', animation: s.anim }}>
          {displayEmoji}
        </div>
      </div>

      {/* Pet picker */}
      {showPicker ? (
        <div style={{ position:'absolute', bottom:90, left:'50%', transform:'translateX(-50%)', background:'rgba(15,23,42,0.92)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:16, padding:'12px 16px', display:'flex', gap:8, alignItems:'center', pointerEvents:'auto', zIndex:60, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
          <span style={{ fontSize:11, color:'#64748b', marginRight:4 }}>Pick a pal</span>
          {PET_OPTIONS.map(a => (
            <button
              key={a.key}
              onClick={() => selectPet(a.key)}
              style={{ fontSize:28, background:'none', border:`2px solid ${a.key === petKey ? 'rgba(244,63,94,0.8)' : 'transparent'}`, cursor:'pointer', padding:'4px 6px', borderRadius:10, transition:'transform 0.15s', lineHeight:1 }}
              title={a.key}
              onMouseOver={e => e.target.style.transform='scale(1.2)'}
              onMouseOut={e => e.target.style.transform='scale(1)'}
            >{a.emoji}</button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
