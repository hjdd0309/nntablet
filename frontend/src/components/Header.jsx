import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'
import logo from '../assets/로고.png'

const LANG_MAP = {
  English: 'ENG',
  '한국어': '한국어',
  Español: 'ESP',
  'にほんご': '日本語',
  '汉语': '中文',
}

export default function Header({ showBack = true, showHome = false, showCall = false, showCamera = false, showVideo = false, backTo, onBack }) {
  const navigate = useNavigate()
  const { language, setShowHelpModal, recordMode, nextShotCountdown } = useApp()
  const t = useT()
  const [time, setTime] = useState('')

  const fmtCountdown = (s) => {
    if (s === null) return ''
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }

  useEffect(() => {
    const update = () => {
      const now = new Date()
      let h = now.getHours()
      const m = now.getMinutes().toString().padStart(2, '0')
      const ampm = h >= 12 ? 'PM' : 'AM'
      h = h % 12 || 12
      setTime(`${h}:${m} ${ampm}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const handleBack = () => {
    if (onBack) { onBack(); return }
    if (backTo) navigate(backTo)
    else navigate(-1)
  }

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        {showBack && (
          <button style={styles.backBtn} onClick={handleBack}>
            <span style={styles.backArrow}>‹</span> {t.back}
          </button>
        )}
        {showCall && (
          <button style={styles.callBtn} onClick={() => setShowHelpModal(true)}>
            <span style={{ marginRight: 4 }}>🤚</span> {t.call}
          </button>
        )}
      </div>

      <div style={styles.center}>
        <img src={logo} alt="나녕" style={styles.logo} />
      </div>

      <div style={styles.right}>
        <span style={styles.time}>{time}</span>
        {showCamera && !recordMode && (
          <button style={styles.iconBtn}>📷</button>
        )}
        {recordMode && nextShotCountdown !== null && (
          <div style={styles.camTimer}>
            <span>📷</span>
            <span style={styles.camTimerLabel}>다음 촬영까지</span>
            <span style={styles.camTimerText}>{fmtCountdown(nextShotCountdown)}</span>
          </div>
        )}
        {showVideo && <button style={styles.iconBtn}>📹</button>}
        <span style={styles.langBadge}>{LANG_MAP[language] || 'ENG'}</span>
        {showHome && (
          <button style={styles.homeBtn} onClick={() => navigate('/overview')}>
            🏠 Home
          </button>
        )}
      </div>
    </header>
  )
}

const styles = {
  header: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 10,
    height: 'calc(64px + env(safe-area-inset-top))',
    background: 'rgba(250, 248, 242, 0.95)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    flexShrink: 0,
    zIndex: 10,
    boxSizing: 'border-box',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    zIndex: 1,
  },
  center: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  logo: {
    height: 36,
    objectFit: 'contain',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: 13,
    fontWeight: 700,
    color: '#2A2720',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 14,
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  backArrow: {
    fontSize: 16,
    lineHeight: 1,
  },
  callBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 700,
    color: '#2A2720',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 14,
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  time: {
    fontSize: 13,
    fontWeight: 700,
    color: '#2A2720',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 14,
    padding: '4px 10px',
  },
  camTimer: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 14,
    padding: '4px 10px',
    fontSize: 13,
  },
  camTimerLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#7A7570',
    fontFamily: 'var(--font)',
  },
  camTimerText: {
    fontSize: 13,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
  },
  langBadge: {
    fontSize: 13,
    fontWeight: 700,
    color: '#2A2720',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 14,
    padding: '4px 10px',
  },
  iconBtn: {
    fontSize: 13,
    fontWeight: 700,
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 14,
    padding: '4px 10px',
    cursor: 'pointer',
    color: '#2A2720',
  },
  recBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 13,
    fontWeight: 700,
    color: '#2A2720',
    background: 'rgba(255,68,68,0.10)',
    border: '1px solid rgba(255,68,68,0.28)',
    borderRadius: 20,
    padding: '4px 10px',
    fontFamily: 'var(--font)',
    flexShrink: 0,
  },
  recDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#FF4444',
    flexShrink: 0,
  },
  homeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 700,
    color: '#2A2720',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 14,
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
}
