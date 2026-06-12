import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useT } from '../i18n'

export default function PackagePage() {
  const navigate = useNavigate()
  const t = useT()

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/6_배경.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/crafting" showCall showHome />
      <h1 style={styles.title}>{t.stepSelectPackage}</h1>
      <StepProgress currentStep={5} />

      <div style={styles.content}>
        <div style={styles.cardRow}>
          {/* 기본 패키지 */}
          <div style={styles.card}>
            <div style={styles.cardBadge}>Basic</div>
            <h2 style={styles.cardTitle}>{t.basicPackageTitle}</h2>
            <p style={styles.cardDesc}>{t.basicPackageDesc}</p>
            <ul style={styles.itemList}>
              {t.basicPackageItems.map((item, i) => (
                <li key={i} style={styles.itemRow}>
                  <span style={styles.itemDot}>✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button style={styles.selectBtn} onClick={() => navigate('/completion')}>
              {t.selectPackageBtn}
            </button>
          </div>

          {/* 특별 패키지 */}
          <div style={{ ...styles.card, ...styles.cardSpecial }}>
            <div style={{ ...styles.cardBadge, ...styles.cardBadgeSpecial }}>Special</div>
            <h2 style={styles.cardTitle}>{t.specialPackageTitle}</h2>
            <p style={styles.cardDesc}>{t.specialPackageDesc}</p>
            <ul style={styles.itemList}>
              {t.specialPackageItems.map((item, i) => (
                <li key={i} style={styles.itemRow}>
                  <span style={styles.itemDot}>✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button style={{ ...styles.selectBtn, ...styles.selectBtnSpecial }} onClick={() => navigate('/completion')}>
              {t.selectPackageBtn}
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
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 60px 32px',
    zIndex: 2,
  },
  cardRow: {
    display: 'flex',
    gap: 28,
    width: '100%',
    maxWidth: 900,
    height: 420,
  },
  card: {
    flex: 1,
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: 24,
    padding: '28px 28px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    border: '1px solid rgba(255,255,255,0.85)',
    position: 'relative',
  },
  cardSpecial: {
    background: 'rgba(255,245,230,0.8)',
    border: '1.5px solid rgba(232,146,78,0.35)',
    boxShadow: '0 4px 28px rgba(232,146,78,0.15)',
  },
  cardBadge: {
    alignSelf: 'flex-start',
    background: 'rgba(42,39,32,0.08)',
    color: '#2A2720',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    borderRadius: 30,
    padding: '4px 12px',
    fontFamily: 'var(--font)',
  },
  cardBadgeSpecial: {
    background: 'linear-gradient(90deg, #F8CB7F, #E8924E)',
    color: '#fff',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    margin: 0,
  },
  cardDesc: {
    fontSize: 13,
    color: '#7A7570',
    fontFamily: 'var(--font)',
    lineHeight: 1.6,
    whiteSpace: 'pre-line',
    margin: 0,
  },
  itemList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#4A4540',
    fontFamily: 'var(--font)',
  },
  itemDot: {
    fontSize: 9,
    color: '#E8924E',
  },
  selectBtn: {
    marginTop: 'auto',
    width: '100%',
    padding: '14px 0',
    borderRadius: 30,
    background: 'rgba(42,39,32,0.08)',
    border: 'none',
    fontSize: 14,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  selectBtnSpecial: {
    background: 'linear-gradient(90deg, #F8CB7F, #E8924E)',
    color: '#fff',
  },
}
