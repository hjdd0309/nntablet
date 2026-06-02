import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'

const LANG_MAP = {
  English: 'ENG',
  '한국어': '한국어',
  Español: 'ESP',
  'にほんご': '日本語',
  '汉语': '中文',
}

export default function Header({ showBack = true, showHome = false, showCall = false, showCamera = false, showVideo = false, backTo }) {
  const navigate = useNavigate()
  const { language, setShowHelpModal } = useApp()
  const t = useT()
  const [time, setTime] = useState('')

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
        <span style={styles.logo}>나녕</span>
      </div>

      <div style={styles.right}>
        <span style={styles.time}>{time}</span>
        {showCamera && <button style={styles.iconBtn}>📷</button>}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: 64,
    background: 'rgba(250, 248, 242, 0.95)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    flexShrink: 0,
    zIndex: 10,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minWidth: 140,
  },
  center: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minWidth: 140,
    justifyContent: 'flex-end',
  },
  logo: {
    fontFamily: "'Nanum Brush Script', cursive",
    fontSize: 28,
    color: '#2A2720',
    letterSpacing: 1,
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: 15,
    fontWeight: 600,
    color: '#2A2720',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 20,
    padding: '6px 14px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  backArrow: {
    fontSize: 20,
    lineHeight: 1,
    marginTop: -1,
  },
  callBtn: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: '#2A2720',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 20,
    padding: '6px 14px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  time: {
    fontSize: 15,
    fontWeight: 600,
    color: '#2A2720',
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
    fontSize: 18,
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 10,
    padding: '4px 8px',
    cursor: 'pointer',
  },
  homeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 14,
    fontWeight: 600,
    color: '#2A2720',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 20,
    padding: '6px 14px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
}
