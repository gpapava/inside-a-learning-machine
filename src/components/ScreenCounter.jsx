export default function ScreenCounter({ current, total }) {
  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      style={{
        fontSize: '12px',
        color: '#9CA3AF',
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 400,
        letterSpacing: '0.05em',
      }}
    >
      {current} / {total}
    </div>
  );
}
