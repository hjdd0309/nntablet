import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { chilboSteps } from '../data/workshops'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'

export default function InformationPage() {
  const navigate = useNavigate()
  const { language } = useApp()
  const t = useT()
  const isKo = language === '한국어'

  return (
    <div style={styles.container}>
      <div style={styles.bgLeft} />
      <div style={styles.bgRight} />

      <Header showBack backTo="/overview" />

      <div style={styles.content}>
        <h1 style={styles.pageTitle}>{t.information}</h1>

        <div style={styles.grid}>
          {/* About Chilbo */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>{t.aboutChilboTitle}</h2>
            <div style={styles.imgPlaceholder} />
            <p style={styles.desc}>{t.aboutChilboDesc}</p>
          </div>

          {/* Choose your Design */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>{t.chooseYourDesignTitle}</h2>
            <p style={styles.desc}>{t.chooseDesignDesc}</p>
            <div style={styles.designRow}>
              <button style={styles.designItem} onClick={() => navigate('/choose-design')}>
                <div style={styles.designIcon}>
                  <GatSvg />
                </div>
                <span style={styles.designLabel}>{t.koreanHatGat}</span>
              </button>
              <button style={styles.designItem} onClick={() => navigate('/choose-design')}>
                <div style={{...styles.designIcon, ...styles.designIconSquare}} />
                <span style={styles.designLabel}>{t.square}</span>
              </button>
            </div>
          </div>

          {/* Price / Duration / Difficulty */}
          <div style={styles.card}>
            <div style={styles.statsRow}>
              {[
                { icon: '✦', label: t.price, value: 'KRW 20,000' },
                { icon: '✦', label: t.duration, value: '50-60min' },
                { icon: '✦', label: t.difficulty, value: 'Easy' },
              ].map((s) => (
                <div key={s.label} style={styles.statItem}>
                  <span style={styles.statIcon}>{s.icon}</span>
                  <span style={styles.statLabel}>{s.label}</span>
                  <span style={styles.statValue}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience progress */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>{t.experienceProgress}</h2>
            <div style={styles.progressRow}>
              {chilboSteps.map((step, i) => (
                <div key={step.id} style={styles.progressItem}>
                  <div style={styles.progressIcon}>✿</div>
                  {i < chilboSteps.length - 1 && <div style={styles.progressLine} />}
                  <span style={styles.progressLabel}>{isKo ? step.labelKo : step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GatSvg() {
  return (
    <svg viewBox="0 0 80 70" width="60" height="52">
      <rect x="22" y="4" width="36" height="36" rx="2" fill="#2A2720" />
      <ellipse cx="40" cy="52" rx="38" ry="14" fill="#2A2720" />
    </svg>
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
  bgLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
    height: '100%',
    background: 'linear-gradient(180deg, #F8CB7F 0%, #E8924E 100%)',
    opacity: 0.3,
    pointerEvents: 'none',
  },
  bgRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '30%',
    height: '100%',
    background: 'linear-gradient(180deg, #F8CB7F 0%, #E8924E 100%)',
    opacity: 0.3,
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    padding: '16px 28px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    overflow: 'hidden',
    zIndex: 2,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    textAlign: 'center',
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: 16,
    overflow: 'hidden',
  },
  card: {
    background: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
  },
  imgPlaceholder: {
    width: '100%',
    height: 100,
    background: 'linear-gradient(45deg, #d4d0c8 25%, transparent 25%), linear-gradient(-45deg, #d4d0c8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4d0c8 75%), linear-gradient(-45deg, transparent 75%, #d4d0c8 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    backgroundColor: '#e8e4dc',
    borderRadius: 10,
    flexShrink: 0,
  },
  desc: {
    fontSize: 12,
    color: '#7A7570',
    lineHeight: 1.6,
  },
  designRow: {
    display: 'flex',
    gap: 20,
    marginTop: 8,
  },
  designItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  designIcon: {
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  designIconSquare: {
    background: '#2A2720',
    borderRadius: 4,
    width: 70,
    height: 70,
  },
  designLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#2A2720',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 28,
    color: '#F8CB7F',
    filter: 'drop-shadow(0 2px 4px rgba(232,146,78,0.4))',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2A2720',
  },
  statValue: {
    fontSize: 14,
    color: '#7A7570',
  },
  progressRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 0,
    overflowX: 'auto',
  },
  progressItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
    minWidth: 60,
  },
  progressIcon: {
    fontSize: 22,
    color: '#E8924E',
  },
  progressLine: {
    position: 'absolute',
    top: 12,
    left: '100%',
    width: '100%',
    height: 2,
    background: '#E0DBD4',
    transform: 'translateX(-50%)',
  },
  progressLabel: {
    fontSize: 9,
    color: '#7A7570',
    textAlign: 'center',
    lineHeight: 1.3,
    whiteSpace: 'pre',
  },
}
