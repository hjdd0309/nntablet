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
        <button style={styles.nextBtn} onClick={() => navigate('/completion')}>
          {t.stepCompletion} →
        </button>
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
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
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
  nextBtn: {
    padding: '16px 40px',
    borderRadius: 30,
    background: 'rgba(210,205,200,0.7)',
    border: '1px solid rgba(0,0,0,0.08)',
    fontSize: 18,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
}
