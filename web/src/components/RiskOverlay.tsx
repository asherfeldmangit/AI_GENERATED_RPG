interface Props { risk: number }

export default function RiskOverlay({ risk }: Props) {
  if (risk < 80) return null;
  const intensity = Math.min((risk - 80) / 20, 1); // 0 to 1
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        background: `rgba(150,0,0,${0.2 + 0.3 * intensity})`,
        animation: 'riskPulse 1s infinite',
        zIndex: 999,
      }}
    />
  );
}

// Global style
const styleTag = document.createElement('style');
styleTag.innerHTML = `@keyframes riskPulse { 0%{opacity:0.8;} 50%{opacity:0.4;} 100%{opacity:0.8;} }`;
document.head.appendChild(styleTag); 