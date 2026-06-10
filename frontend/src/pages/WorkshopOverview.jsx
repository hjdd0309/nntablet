import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'

export default function WorkshopOverview() {
  const navigate = useNavigate()
  const t = useT()
  const { setShowHelpModal } = useApp()

  return (
    <div style={styles.container}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/홈.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />
      <Header showBack backTo="/state" showCall showHome />
      <h1 style={styles.title}>{t.welcomeTitle}</h1>
      <StepProgress currentStep={0} />

      <div style={styles.content}>

        <div style={styles.grid}>
          {/* Large: Explore Gallery */}
          <button style={{...styles.card, ...styles.cardLarge}} onClick={() => navigate('/gallery')}>
            <span style={styles.cardArrow}>→</span>
            <div style={styles.cardMeta}>
              <span style={styles.cardMetaIcon}>🖼</span>
              <span style={styles.cardMetaLabel}>{t.chilboMeta}</span>
            </div>
            <span style={styles.cardTitle}>{t.exploreToGallery}</span>
          </button>

          {/* Right column */}
          <div style={styles.rightCol}>
            {/* What is Chilbo */}
            <button style={styles.card} onClick={() => navigate('/video')}>
              <span style={styles.cardArrow}>→</span>
              <div style={styles.cardMeta}>
                <span style={styles.cardMetaIcon}>❓</span>
                <span style={styles.cardMetaLabel}>{t.chilboMeta}</span>
              </div>
              <span style={styles.cardTitle}>{t.whatIsChilbo}</span>
            </button>

            {/* About Chilbo */}
            <button style={styles.card} onClick={() => navigate('/info')}>
              <span style={styles.cardArrow}>→</span>
              <div style={styles.cardMeta}>
                <span style={styles.cardMetaIcon}>ℹ</span>
                <span style={styles.cardMetaLabel}>{t.priceMeta}</span>
              </div>
              <span style={styles.cardTitle}>{t.aboutChilbo}</span>
            </button>

            {/* Ask for Help */}
            <button style={styles.card} onClick={() => setShowHelpModal(true)}>
              <span style={styles.cardArrow}>→</span>
              <div style={styles.cardMeta}>
                <span style={styles.cardMetaIcon}>🤚</span>
                <span style={styles.cardMetaLabel}>{t.chilboMeta}</span>
              </div>
              <span style={styles.cardTitle}>{t.askForHelp}</span>
            </button>

            {/* Ready to Enjoy */}
            <button style={{...styles.card, ...styles.cardHighlight}} onClick={() => navigate('/process-log')}>
              <span style={styles.cardArrow}>→</span>
              <div style={styles.cardMeta}>
                <span style={styles.cardMetaIcon}>🎊</span>
                <span style={styles.cardMetaLabel}>{t.chilboMeta}</span>
              </div>
              <span style={styles.cardTitle}>{t.readyToEnjoyBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
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
  bgGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '55%',
    height: '70%',
    background: 'radial-gradient(ellipse at top right, #F8CB7F 0%, #E8924E 40%, transparent 70%)',
    opacity: 0.45,
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    padding: '16px 32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    zIndex: 2,
    textAlign: 'center',
    padding: '20px 32px 0',
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    overflow: 'hidden',
  },
  rightCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  card: {
    background: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: '20px 20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    cursor: 'pointer',
    transition: 'transform 0.15s',
    fontFamily: 'var(--font)',
    textAlign: 'left',
    overflow: 'hidden',
    backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.6) 0%, rgba(248,203,127,0.15) 100%)',
  },
  cardLarge: {
    backgroundImage: 'linear-gradient(160deg, rgba(248,203,127,0.3) 0%, rgba(232,146,78,0.2) 100%)',
    backgroundSize: '100% 60%',
    backgroundRepeat: 'no-repeat',
  },
  cardHighlight: {
    backgroundImage: 'linear-gradient(160deg, rgba(248,203,127,0.4) 0%, rgba(232,146,78,0.25) 100%)',
  },
  cardArrow: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '1.5px solid rgba(42,39,32,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    marginBottom: 'auto',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
    paddingTop: 12,
  },
  cardMetaIcon: {
    fontSize: 12,
  },
  cardMetaLabel: {
    fontSize: 10,
    color: '#7A7570',
    fontWeight: 600,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#2A2720',
    marginTop: 4,
  },
}
