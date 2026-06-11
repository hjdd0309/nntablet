import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useT } from '../i18n'

const VIDEO_SRC = '/chilbo.mp4'

export default function ChooseDesign() {
  const navigate = useNavigate()
  const t = useT()
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)
  const [ended, setEnded] = useState(false)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (ended) { v.currentTime = 0; setEnded(false) }
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/3_배경.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/process-log" showCall showHome />
      <h1 style={styles.title}>{t.stepChilboVideo}</h1>
      <StepProgress currentStep={2} />

      <div style={styles.content}>
        <div style={styles.videoCard}>
          {error ? (
            <div style={styles.placeholder}>
              <span style={styles.placeholderIcon}>🎬</span>
              <p style={styles.placeholderText}>{t.chilboVideoPlaceholder}</p>
            </div>
          ) : (
            <div style={styles.videoWrap} onClick={toggle}>
              <video
                ref={videoRef}
                src={VIDEO_SRC}
                style={styles.video}
                playsInline
                onError={() => setError(true)}
                onEnded={() => { setPlaying(false); setEnded(true) }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
              {!playing && (
                <div style={styles.playOverlay}>
                  <div style={styles.playBtn}>
                    <span style={styles.playIcon}>{ended ? '↺' : '▶'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button style={styles.nextBtn} onClick={() => navigate('/gallery', { state: { fromFlow: true } })}>
          {t.exploreToGallery} →
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
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    textAlign: 'center',
    padding: '20px 32px 0',
    zIndex: 2,
    position: 'relative',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 60px 24px',
    gap: 20,
    zIndex: 2,
    overflow: 'hidden',
  },
  videoCard: {
    width: '100%',
    maxWidth: 860,
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
    background: '#1a1814',
    aspectRatio: '16 / 9',
    flexShrink: 0,
  },
  videoWrap: {
    width: '100%',
    height: '100%',
    position: 'relative',
    cursor: 'pointer',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.25)',
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  playIcon: {
    fontSize: 28,
    color: '#2A2720',
    marginLeft: 4,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderIcon: { fontSize: 52 },
  placeholderText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'var(--font)',
    textAlign: 'center',
  },
  nextBtn: {
    padding: '14px 36px',
    borderRadius: 30,
    background: 'linear-gradient(135deg, #F8CB7F 0%, #E8924E 100%)',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    flexShrink: 0,
  },
}
