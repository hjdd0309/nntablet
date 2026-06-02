import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useT } from '../i18n'

const CARDS = [
  { key: 'exploreNearby',   icon: '📍', route: '/workshops' },
  { key: 'shareMyArtwork',  icon: '🎨', route: '/gallery'   },
  { key: 'processHistory',  icon: '🎬', route: '/video'     },
]

export default function CompletionPage() {
  const navigate = useNavigate()
  const t = useT()

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bg-white.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/package" showCall showHome />
      <StepProgress currentStep={6} />

      <div style={styles.content}>
        <h1 style={styles.title}>{t.artworkComplete}</h1>

        <div style={styles.cardRow}>
          {CARDS.map(({ key, icon, route }) => (
            <button key={key} style={styles.card} onClick={() => navigate(route)}>
              <span style={styles.arrow}>→</span>
              <div style={styles.cardBottom}>
                <span style={styles.cardIcon}>{icon}</span>
                <span style={styles.cardLabel}>{t[key]}</span>
              </div>
            </button>
          ))}
        </div>
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
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 60px 24px',
    gap: 32,
    zIndex: 2,
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    textAlign: 'center',
    flexShrink: 0,
  },
  cardRow: {
    display: 'flex',
    gap: 24,
    width: '100%',
    maxWidth: 900,
  },
  card: {
    flex: 1,
    height: 260,
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
    fontFamily: 'var(--font)',
    backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(248,203,127,0.15) 100%)',
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
  cardBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardLabel: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2A2720',
    textAlign: 'left',
    lineHeight: 1.3,
    paddingBottom: 4,
  },
}
