import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n'

function DecoShapes() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1210 770" preserveAspectRatio="xMidYMid slice">
      <ellipse cx="140" cy="160" rx="80" ry="110" fill="#D4D0C8" opacity="0.6" transform="rotate(-15, 140, 160)" />
      <ellipse cx="100" cy="220" rx="55" ry="80" fill="#D4D0C8" opacity="0.5" transform="rotate(20, 100, 220)" />
      <ellipse cx="180" cy="210" rx="55" ry="80" fill="#D4D0C8" opacity="0.5" transform="rotate(-20, 180, 210)" />
      <ellipse cx="1060" cy="130" rx="60" ry="100" fill="#E8947A" opacity="0.45" transform="rotate(-30, 1060, 130)" />
      <ellipse cx="1110" cy="170" rx="60" ry="100" fill="#E8947A" opacity="0.45" transform="rotate(60, 1110, 170)" />
      <ellipse cx="1140" cy="100" rx="60" ry="100" fill="#E8947A" opacity="0.45" transform="rotate(30, 1140, 100)" />
      <ellipse cx="1090" cy="80" rx="60" ry="100" fill="#E8947A" opacity="0.45" transform="rotate(-60, 1090, 80)" />
      <polygon points="70,420 85,470 140,470 96,500 112,550 70,520 28,550 44,500 0,470 55,470" fill="#F5C842" opacity="0.75" transform="translate(0, -20)" />
      <path d="M 280 680 Q 280 620 340 620 Q 400 620 400 680 Q 370 700 340 700 Q 310 700 280 680 Z" fill="#F0EEE8" opacity="0.75" />
      <circle cx="1050" cy="640" r="55" fill="#A8C0CC" opacity="0.4" />
      <circle cx="1050" cy="570" r="40" fill="#A8C0CC" opacity="0.35" />
      <circle cx="1115" cy="605" r="40" fill="#A8C0CC" opacity="0.35" />
      <circle cx="985" cy="605" r="40" fill="#A8C0CC" opacity="0.35" />
      <circle cx="1050" cy="710" r="40" fill="#A8C0CC" opacity="0.35" />
      <circle cx="430" cy="430" r="55" fill="#E8B0B8" opacity="0.45" />
      <circle cx="430" cy="365" r="42" fill="#E8B0B8" opacity="0.4" />
      <circle cx="488" cy="395" r="42" fill="#E8B0B8" opacity="0.4" />
      <circle cx="466" cy="460" r="42" fill="#E8B0B8" opacity="0.4" />
      <circle cx="394" cy="460" r="42" fill="#E8B0B8" opacity="0.4" />
      <circle cx="372" cy="395" r="42" fill="#E8B0B8" opacity="0.4" />
      <circle cx="860" cy="490" r="42" fill="#C0C4E8" opacity="0.4" />
      <circle cx="860" cy="432" r="34" fill="#C0C4E8" opacity="0.35" />
      <circle cx="906" cy="458" r="34" fill="#C0C4E8" opacity="0.35" />
      <circle cx="890" cy="516" r="34" fill="#C0C4E8" opacity="0.35" />
      <circle cx="830" cy="516" r="34" fill="#C0C4E8" opacity="0.35" />
      <circle cx="814" cy="458" r="34" fill="#C0C4E8" opacity="0.35" />
    </svg>
  )
}

export default function StateSelect() {
  const navigate = useNavigate()
  const t = useT()

  return (
    <div style={styles.container}>
      <DecoShapes />

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
