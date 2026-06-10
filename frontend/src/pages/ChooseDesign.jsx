import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'

export default function ChooseDesign() {
  const navigate = useNavigate()
  const { setSelectedDesign } = useApp()
  const t = useT()

  const handleSelect = (design) => {
    setSelectedDesign(design)
    navigate('/sketch')
  }

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/3_배경.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/process-log" showCall showCamera showHome />
      <h1 style={styles.title}>{t.chooseYourDesign}</h1>
      <StepProgress currentStep={2} />

      <div style={styles.content}>
        <div style={styles.cardRow}>
          <button style={styles.card} onClick={() => handleSelect('gat')}>
            <span style={styles.arrow}>→</span>
            <span style={styles.cardLabel}>{t.koreanHat.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</span>
          </button>
          <button style={styles.card} onClick={() => handleSelect('rectangle')}>
            <span style={styles.arrow}>→</span>
            <span style={styles.cardLabel}>{t.rectangularBase.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function BgBlobs() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1210 770" preserveAspectRatio="xMidYMid slice">
      <circle cx="200" cy="200" r="180" fill="#B8B8D0" opacity="0.3" />
      <circle cx="350" cy="350" r="220" fill="#C0BAD8" opacity="0.25" />
      <circle cx="150" cy="500" r="160" fill="#B4B0CC" opacity="0.2" />
      <circle cx="900" cy="150" r="200" fill="#C8C4E0" opacity="0.25" />
      <circle cx="1050" cy="400" r="240" fill="#B0B0CC" opacity="0.2" />
    </svg>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    background: '#F5F2EA',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  bgBlobs: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 25% 40%, rgba(200,196,220,0.8) 0%, transparent 60%), radial-gradient(circle at 75% 60%, rgba(180,176,210,0.8) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    padding: '0 60px',
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    textAlign: 'center',
    padding: '20px 32px 0',
    zIndex: 2,
    position: 'relative',
  },
  cardRow: {
    display: 'flex',
    gap: 24,
    width: '100%',
    maxWidth: 800,
  },
  card: {
    flex: 1,
    height: 260,
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '24px 28px',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    fontFamily: 'var(--font)',
    backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.35) 0%, rgba(248,203,127,0.15) 100%)',
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
  cardLabel: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2A2720',
    textAlign: 'left',
    lineHeight: 1.3,
    marginTop: 'auto',
    paddingBottom: 8,
  },
}
