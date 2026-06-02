import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useT } from '../i18n'

export default function ProcessLog() {
  const navigate = useNavigate()
  const t = useT()
  const [mode, setMode] = useState(null) // null | 'timelapse' | 'photos'
  const [timelapse, setTimelapse] = useState(null) // null | 'yes' | 'no'
  const [photos, setPhotos] = useState(null) // null | 'yes' | 'no'

  const showCamera = mode !== null

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bg-white.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header
        showBack
        backTo="/sketch"
        showCall
        showVideo={mode === 'timelapse'}
        showCamera={mode === 'photos'}
        showHome
      />
      <StepProgress currentStep={1} />

      <h1 style={styles.title}>{t.logYourCraft}</h1>

      {/* Mode selection */}
      {mode === null && (
        <div style={styles.content}>
          <div style={styles.cardRow}>
            <button style={styles.card} onClick={() => setMode('timelapse')}>
              <span style={styles.arrow}>→</span>
              <span style={styles.cardLabel}>{t.timelapse}</span>
            </button>
            <button style={styles.card} onClick={() => setMode('photos')}>
              <span style={styles.arrow}>→</span>
              <span style={styles.cardLabel}>{t.photoAlerts}</span>
            </button>
          </div>
        </div>
      )}

      {/* Timelapse flow */}
      {mode === 'timelapse' && (
        <div style={styles.content}>
          <div style={styles.splitLayout}>
            <div style={{...styles.cameraView, ...styles.checkered}} />
            <div style={styles.promptCard}>
              {timelapse === null && (
                <>
                  <h2 style={styles.promptTitle}>{t.saveYourProcess}</h2>
                  <p style={styles.promptSub}>{t.createTimelapse}</p>
                  <button style={styles.btnNo} onClick={() => { setTimelapse('no'); navigate('/overview') }}>
                    {t.noThanks}
                  </button>
                  <button style={styles.btnYes} onClick={() => { setTimelapse('yes'); navigate('/video') }}>
                    {t.yesPlease}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo alerts flow */}
      {mode === 'photos' && (
        <div style={styles.content}>
          <div style={styles.splitLayout}>
            <div style={{...styles.cameraView, ...styles.checkered, position: 'relative'}}>
              <div style={styles.photoTooltip}>
                <span style={styles.photoIcon}>📷</span>
                <p style={styles.photoTooltipText}>{t.takeAPhoto}</p>
              </div>
            </div>
            <div style={styles.promptCard}>
              {photos === null && (
                <>
                  <h2 style={styles.promptTitle}>{t.takeProgressPhotos}</h2>
                  <p style={styles.promptSub}>{t.photoReminderSub}</p>
                  <button style={styles.btnNo} onClick={() => { setPhotos('no'); navigate('/overview') }}>
                    {t.noThanks}
                  </button>
                  <button style={styles.btnYes} onClick={() => { setPhotos('yes'); navigate('/overview') }}>
                    {t.yesPlease}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
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
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    height: '50%',
    background: 'radial-gradient(ellipse at top center, rgba(210,205,195,0.5) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    textAlign: 'center',
    paddingBottom: 8,
    zIndex: 2,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 60px 24px',
    zIndex: 2,
    overflow: 'hidden',
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
  cardLabel: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2A2720',
    textAlign: 'left',
    lineHeight: 1.3,
    marginTop: 'auto',
    paddingBottom: 8,
  },
  splitLayout: {
    display: 'flex',
    gap: 24,
    width: '100%',
    maxWidth: 1000,
    height: 380,
  },
  cameraView: {
    flex: 1.5,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  checkered: {
    backgroundImage: 'linear-gradient(45deg, #d4d0c8 25%, transparent 25%), linear-gradient(-45deg, #d4d0c8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4d0c8 75%), linear-gradient(-45deg, transparent 75%, #d4d0c8 75%)',
    backgroundSize: '24px 24px',
    backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
    backgroundColor: '#e8e4dc',
  },
  promptCard: {
    flex: 1,
    background: 'rgba(255,255,255,0.6)',
    borderRadius: 20,
    padding: '28px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#2A2720',
    textAlign: 'center',
    fontFamily: 'var(--font)',
  },
  promptSub: {
    fontSize: 13,
    color: '#7A7570',
    textAlign: 'center',
    marginBottom: 8,
  },
  btnNo: {
    width: '100%',
    padding: '16px',
    borderRadius: 30,
    background: 'rgba(250,248,242,0.8)',
    border: '1px solid rgba(0,0,0,0.06)',
    fontSize: 16,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  btnYes: {
    width: '100%',
    padding: '16px',
    borderRadius: 30,
    background: 'rgba(210,205,200,0.7)',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  photoTooltip: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(250,248,242,0.9)',
    borderRadius: 16,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  },
  photoIcon: {
    fontSize: 32,
  },
  photoTooltipText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2A2720',
  },
}
