import React from 'react';

export function BackgroundOrbs() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Orb A — large, top-left area */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-15%',
        width: '60vw',
        height: '60vw',
        maxWidth: '520px',
        maxHeight: '520px',
        borderRadius: '50%',
        background: 'var(--luna-orb-a)',
        filter: 'blur(80px)',
        animation: 'orbFloat1 22s ease-in-out infinite',
        willChange: 'transform',
      }} />

      {/* Orb B — medium, bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        maxWidth: '420px',
        maxHeight: '420px',
        borderRadius: '50%',
        background: 'var(--luna-orb-b)',
        filter: 'blur(70px)',
        animation: 'orbFloat2 28s ease-in-out infinite',
        willChange: 'transform',
      }} />

      {/* Orb C — small, center-right */}
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '15%',
        width: '30vw',
        height: '30vw',
        maxWidth: '260px',
        maxHeight: '260px',
        borderRadius: '50%',
        background: 'var(--luna-orb-c)',
        filter: 'blur(60px)',
        animation: 'orbFloat3 18s ease-in-out infinite',
        willChange: 'transform',
      }} />
    </div>
  );
}
