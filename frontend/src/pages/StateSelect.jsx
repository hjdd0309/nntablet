import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n'


export default function StateSelect() {
  const navigate = useNavigate()
  const t = useT()

  return (
    <div style={styles.container}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/bg-flowers.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />

      <button style={styles.backBtn} onClick={() => navigate('/language')}>
        ‹ {t.back}
      </button>

      <h1 style={styles.title}>{t.chooseState}</h1>

      <div style={styles.cardRow}>
        <button style={styles.card} onClick={() => navigate('/workshops')}>
          <span style={styles.arrow}>→</span>
          <span style={styles.label}>{t.imWaiting}</span>
        </button>
        <button style={styles.card} onClick={() => navigate('/overview')}>
          <span style={styles.arrow}>→</span>
          <span style={styles.label}>{t.readyToEnjoy.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</span>
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    background: '#FAF8F2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 15,
    fontWeight: 600,
    color: '#2A2720',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 20,
    padding: '6px 16px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    zIndex: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    color: '#2A2720',
    marginBottom: 48,
    zIndex: 2,
    fontFamily: 'var(--font)',
  },
  cardRow: {
    display: 'flex',
    gap: 24,
    zIndex: 2,
  },
  card: {
    width: 300,
    height: 280,
    background: 'rgba(255,255,255,0.35)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '24px 28px',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    fontFamily: 'var(--font)',
    backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(248,203,127,0.25) 100%)',
  },
  arrow: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1.5px solid #2A2720',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  label: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2A2720',
    textAlign: 'left',
    lineHeight: 1.3,
    marginTop: 'auto',
    paddingBottom: 8,
  },
}
