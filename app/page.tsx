import FileUpload from '@/components/FileUpload'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,146,42,0.06) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.7rem',
          letterSpacing: '0.35em',
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          CLASSIFIED // FIELD TERMINAL
        </div>
        <h1 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          color: 'var(--color-text)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: 0,
        }}>
          R.E.P.O<span style={{ color: 'var(--color-accent)' }}>_</span>VAULT
          <span className="cursor-blink" style={{ color: 'var(--color-accent)', marginLeft: '2px' }}>█</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '1rem',
          color: 'var(--color-text-muted)',
          marginTop: '0.75rem',
          letterSpacing: '0.04em',
        }}>
          Save file editor for R.E.P.O — no installation required
        </p>
      </div>

      {/* Upload card */}
      <div className="animate-fade-in stagger-2" style={{ width: '100%', maxWidth: '520px' }}>
        <FileUpload />
      </div>

      {/* Footer hint */}
      <div className="animate-fade-in stagger-4" style={{
        marginTop: '2.5rem',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        letterSpacing: '0.06em',
        textAlign: 'center',
      }}>
        DROP YOUR <span style={{ color: 'var(--color-accent)' }}>.ES3</span> FILE TO BEGIN DECRYPTION
      </div>
    </main>
  )
}
