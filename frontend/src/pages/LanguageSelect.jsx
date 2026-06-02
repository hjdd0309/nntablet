import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'

const LANGUAGES = ['Español', 'English', '한국어', 'にほんご', '汉语']

// Decorative shape SVGs
function DecoShapes() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1210 770" preserveAspectRatio="xMidYMid slice">
      {/* Tulip - top left */}
      <ellipse cx="140" cy="160" rx="80" ry="110" fill="#D4D0C8" opacity="0.7" transform="rotate(-15, 140, 160)" />
      <ellipse cx="100" cy="220" rx="55" ry="80" fill="#D4D0C8" opacity="0.6" transform="rotate(20, 100, 220)" />
      <ellipse cx="180" cy="210" rx="55" ry="80" fill="#D4D0C8" opacity="0.6" transform="rotate(-20, 180, 210)" />
      {/* Butterfly/4-petal flower - top right */}
      <ellipse cx="1060" cy="130" rx="60" ry="100" fill="#E8947A" opacity="0.55" transform="rotate(-30, 1060, 130)" />
      <ellipse cx="1110" cy="170" rx="60" ry="100" fill="#E8947A" opacity="0.55" transform="rotate(60, 1110, 170)" />
      <ellipse cx="1140" cy="100" rx="60" ry="100" fill="#E8947A" opacity="0.55" transform="rotate(30, 1140, 100)" />
      <ellipse cx="1090" cy="80" rx="60" ry="100" fill="#E8947A" opacity="0.55" transform="rotate(-60, 1090, 80)" />
      {/* Yellow star - left */}
      <polygon points="70,420 85,470 140,470 96,500 112,550 70,520 28,550 44,500 0,470 55,470" fill="#F5C842" opacity="0.8" transform="translate(0, -20)" />
      {/* Clam shell - bottom center-left */}
      <path d="M 280 680 Q 280 620 340 620 Q 400 620 400 680 Q 370 700 340 700 Q 310 700 280 680 Z" fill="#F0EEE8" opacity="0.75" />
      <line x1="340" y1="620" x2="310" y2="700" stroke="#D8D4CC" strokeWidth="1.5" opacity="0.5" />
      <line x1="340" y1="620" x2="325" y2="702" stroke="#D8D4CC" strokeWidth="1.5" opacity="0.5" />
      <line x1="340" y1="620" x2="340" y2="702" stroke="#D8D4CC" strokeWidth="1.5" opacity="0.5" />
      <line x1="340" y1="620" x2="355" y2="702" stroke="#D8D4CC" strokeWidth="1.5" opacity="0.5" />
      <line x1="340" y1="620" x2="370" y2="700" stroke="#D8D4CC" strokeWidth="1.5" opacity="0.5" />
      {/* Light blue flower - bottom right */}
      <circle cx="1050" cy="640" r="55" fill="#A8C0CC" opacity="0.45" />
      <circle cx="1050" cy="570" r="40" fill="#A8C0CC" opacity="0.4" />
      <circle cx="1115" cy="605" r="40" fill="#A8C0CC" opacity="0.4" />
      <circle cx="985" cy="605" r="40" fill="#A8C0CC" opacity="0.4" />
      <circle cx="1050" cy="710" r="40" fill="#A8C0CC" opacity="0.4" />
      {/* Pink 5-petal flower - center-left */}
      <circle cx="420" cy="430" r="45" fill="#E8A0B0" opacity="0.5" />
      <circle cx="420" cy="365" r="36" fill="#E8A0B0" opacity="0.45" />
      <circle cx="474" cy="397" r="36" fill="#E8A0B0" opacity="0.45" />
      <circle cx="453" cy="463" r="36" fill="#E8A0B0" opacity="0.45" />
      <circle cx="387" cy="463" r="36" fill="#E8A0B0" opacity="0.45" />
      <circle cx="366" cy="397" r="36" fill="#E8A0B0" opacity="0.45" />
      {/* Lavender flower - right center */}
      <circle cx="870" cy="500" r="40" fill="#C0B4E8" opacity="0.45" />
      <circle cx="870" cy="438" r="32" fill="#C0B4E8" opacity="0.4" />
      <circle cx="918" cy="466" r="32" fill="#C0B4E8" opacity="0.4" />
      <circle cx="900" cy="524" r="32" fill="#C0B4E8" opacity="0.4" />
      <circle cx="840" cy="524" r="32" fill="#C0B4E8" opacity="0.4" />
      <circle cx="822" cy="466" r="32" fill="#C0B4E8" opacity="0.4" />
      {/* Peach teardrop - upper right */}
      <ellipse cx="820" cy="140" rx="35" ry="50" fill="#ECC0B0" opacity="0.55" transform="rotate(-15, 820, 140)" />
    </svg>
  )
}

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { setLanguage } = useApp()
  const t = useT()
  const [selected, setSelected] = useState('한국어')
  const selectedIdx = LANGUAGES.indexOf(selected)

  const handleSelect = (lang) => {
    setSelected(lang)
    setLanguage(lang)
    setTimeout(() => navigate('/state'), 300)
  }

  return (
    <div style={styles.container}>
      <DecoShapes />

      {/* Back button */}
      <button style={styles.backBtn} onClick={() => navigate('/')}>
        ‹ {t.back}
      </button>

      <h1 style={styles.title}>{t.chooseLanguage}</h1>

      {/* Scroll picker */}
      <div style={styles.pickerWrap}>
        {LANGUAGES.map((lang, i) => {
          const offset = i - selectedIdx
          const isCenter = offset === 0
          const isNear = Math.abs(offset) === 1
          return (
            <button
              key={lang}
              style={{
                ...styles.langItem,
                ...(isCenter ? styles.langItemCenter : {}),
                ...(isNear ? styles.langItemNear : {}),
                ...(!isCenter && !isNear ? styles.langItemFar : {}),
              }}
              onClick={() => handleSelect(lang)}
            >
              {lang}
            </button>
          )
        })}
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 15,
    fontWeight: 600,
    color: '#2A2720',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 20,
    padding: '6px 16px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    zIndex: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    color: '#2A2720',
    marginBottom: 48,
    zIndex: 2,
    fontFamily: 'var(--font)',
  },
  pickerWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
    background: 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(12px)',
    borderRadius: 24,
    padding: '8px 80px',
    border: '1px solid rgba(255,255,255,0.6)',
    zIndex: 2,
    minWidth: 380,
  },
  langItem: {
    width: '100%',
    padding: '14px 24px',
    border: 'none',
    background: 'none',
    fontSize: 22,
    fontWeight: 500,
    color: '#ADA9A4',
    cursor: 'pointer',
    borderRadius: 14,
    transition: 'all 0.2s',
    fontFamily: 'var(--font)',
    textAlign: 'center',
  },
  langItemCenter: {
    fontSize: 30,
    fontWeight: 700,
    color: '#2A2720',
    background: '#fff',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  langItemNear: {
    fontSize: 22,
    color: '#7A7570',
  },
  langItemFar: {
    fontSize: 18,
    color: '#C8C3BE',
    opacity: 0.7,
  },
}
