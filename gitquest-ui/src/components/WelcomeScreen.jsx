function PulseDot() {
  return (
    <span style={{
      width: 7, height: 7, borderRadius: '50%', background: '#00ff88',
      display: 'inline-block',
      animation: 'sb-pulse 1.5s infinite',
    }} />
  )
}

function WelcomeScreen({ onSelect }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.12em', color: '#00ff88', border: '1px solid #00ff8844', borderRadius: 4, padding: '5px 14px', marginBottom: '1.5rem' }}>
        <PulseDot /> LIVE THREAT DETECTED
      </div>

      <h1 style={{ fontSize: 38, fontWeight: 500, color: '#e8f4fd', textAlign: 'center', marginBottom: 8, fontFamily: 'monospace' }}>
        Git<span style={{ color: '#00ff88' }}>Quest</span>
      </h1>

      <p style={{ fontSize: 14, color: '#4a6fa5', textAlign: 'center', lineHeight: 1.7, maxWidth: 460, marginBottom: '2rem' }}>
        Learn git with hacker themed interactive lessons & quizzes
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%', maxWidth: 560, marginBottom: '1.5rem' }}>
        {[
          { id: 'new', icon: '☰', title: 'New recruit', desc: 'Guided missions, unlocked in order. Learn Git through the operation.' },
          { id: 'vet', icon: '🗺', title: 'Field agent', desc: 'Free roam — jump to any mission. You know the tools.' },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            style={{ background: '#0d1526', border: '1px solid #1a2a45', borderRadius: 10, padding: '1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#00ff88'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1a2a45'}
          >
            <div style={{ fontSize: 22, color: '#00ff88', marginBottom: 10 }}>{opt.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#c8daf0', marginBottom: 5 }}>{opt.title}</div>
            <div style={{ fontSize: 12, color: '#4a6fa5', lineHeight: 1.5 }}>{opt.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#2a3a55' }}>
        ℹ Clearance level saved between sessions
      </div>
    </div>
  )
}

export default WelcomeScreen;