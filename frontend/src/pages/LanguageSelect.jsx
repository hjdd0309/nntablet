import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'

const LANGUAGES = ['Español', 'English', '한국어', 'にほんご', '汉语']
const ITEM_HEIGHT = 64
const VISIBLE = 5
const HALF = Math.floor(VISIBLE / 2)

function DecoShapes() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1210 770" preserveAspectRatio="xMidYMid slice">
      <ellipse cx="140" cy="160" rx="80" ry="110" fill="#D4D0C8" opacity="0.7" transform="rotate(-15, 140, 160)" />
      <ellipse cx="100" cy="220" rx="55" ry="80" fill="#D4D0C8" opacity="0.6" transform="rotate(20, 100, 220)" />
      <ellipse cx="180" cy="210" rx="55" ry="80" fill="#D4D0C8" opacity="0.6" transform="rotate(-20, 180, 210)" />
      <ellipse cx="1060" cy="130" rx="60" ry="100" fill="#E8947A" opacity="0.55" transform="rotate(-30, 1060, 130)" />
      <ellipse cx="1110" cy="170" rx="60" ry="100" fill="#E8947A" opacity="0.55" transform="rotate(60, 1110, 170)" />
      <ellipse cx="1140" cy="100" rx="60" ry="100" fill="#E8947A" opacity="0.55" transform="rotate(30, 1140, 100)" />
      <ellipse cx="1090" cy="80" rx="60" ry="100" fill="#E8947A" opacity="0.55" transform="rotate(-60, 1090, 80)" />
      <polygon points="70,420 85,470 140,470 96,500 112,550 70,520 28,550 44,500 0,470 55,470" fill="#F5C842" opacity="0.8" transform="translate(0, -20)" />
      <path d="M 280 680 Q 280 620 340 620 Q 400 620 400 680 Q 370 700 340 700 Q 310 700 280 680 Z" fill="#F0EEE8" opacity="0.75" />
      <line x1="340" y1="620" x2="310" y2="700" stroke="#D8D4CC" strokeWidth="1.5" opacity="0.5" />
      <line x1="340" y1="620" x2="325" y2="702" stroke="#D8D4CC" strokeWidth="1.5" opacity="0.5" />
      <line x1="340" y1="620" x2="340" y2="702" stroke="#D8D4CC" strokeWidth="1.5" opacity="0.5" />
      <line x1="340" y1="620" x2="355" y2="702" stroke="#D8D4CC" strokeWidth="1.5" opacity="0.5" />
      <line x1="340" y1="620" x2="370" y2="700" stroke="#D8D4CC" strokeWidth="1.5" opacity="0.5" />
      <circle cx="1050" cy="640" r="55" fill="#A8C0CC" opacity="0.45" />
      <circle cx="1050" cy="570" r="40" fill="#A8C0CC" opacity="0.4" />
      <circle cx="1115" cy="605" r="40" fill="#A8C0CC" opacity="0.4" />
      <circle cx="985" cy="605" r="40" fill="#A8C0CC" opacity="0.4" />
      <circle cx="1050" cy="710" r="40" fill="#A8C0CC" opacity="0.4" />
      <circle cx="420" cy="430" r="45" fill="#E8A0B0" opacity="0.5" />
      <circle cx="420" cy="365" r="36" fill="#E8A0B0" opacity="0.45" />
      <circle cx="474" cy="397" r="36" fill="#E8A0B0" opacity="0.45" />
      <circle cx="453" cy="463" r="36" fill="#E8A0B0" opacity="0.45" />
      <circle cx="387" cy="463" r="36" fill="#E8A0B0" opacity="0.45" />
      <circle cx="366" cy="397" r="36" fill="#E8A0B0" opacity="0.45" />
      <circle cx="870" cy="500" r="40" fill="#C0B4E8" opacity="0.45" />
      <circle cx="870" cy="438" r="32" fill="#C0B4E8" opacity="0.4" />
      <circle cx="918" cy="466" r="32" fill="#C0B4E8" opacity="0.4" />
      <circle cx="900" cy="524" r="32" fill="#C0B4E8" opacity="0.4" />
      <circle cx="840" cy="524" r="32" fill="#C0B4E8" opacity="0.4" />
      <circle cx="822" cy="466" r="32" fill="#C0B4E8" opacity="0.4" />
      <ellipse cx="820" cy="140" rx="35" ry="50" fill="#ECC0B0" opacity="0.55" transform="rotate(-15, 820, 140)" />
    </svg>
  )
}

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { setLanguage } = useApp()
  const t = useT()

  const [selectedIdx, setSelectedIdx] = useState(LANGUAGES.indexOf('한국어'))
  const [dragDelta, setDragDelta] = useState(0)
  const [isSnapping, setIsSnapping] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const dragRef = useRef({ active: false, startY: 0, lastDelta: 0, moved: false })

  // Which item is visually centered right now
  const centeredIdx = Math.max(0, Math.min(LANGUAGES.length - 1,
    Math.round(selectedIdx - dragDelta / ITEM_HEIGHT)
  ))

  // Track translation: center selectedIdx + live drag offset
  const trackY = (HALF - selectedIdx) * ITEM_HEIGHT + dragDelta

  const getY = (e) => e.touches ? e.touches[0].clientY : e.clientY

  const onDragStart = (e) => {
    setIsSnapping(false)
    setIsDragging(true)
    dragRef.current = { active: true, startY: getY(e), lastDelta: 0, moved: false }
  }

  const onDragMove = (e) => {
    if (!dragRef.current.active) return
    const delta = getY(e) - dragRef.current.startY
    dragRef.current.lastDelta = delta
    if (Math.abs(delta) > 5) dragRef.current.moved = true
    setDragDelta(delta)
  }

  const onDragEnd = () => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    setIsDragging(false)

    const newIdx = Math.max(0, Math.min(LANGUAGES.length - 1,
      Math.round(selectedIdx - dragRef.current.lastDelta / ITEM_HEIGHT)
    ))

    setIsSnapping(true)
    setDragDelta(0)
    setSelectedIdx(newIdx)
    setLanguage(LANGUAGES[newIdx])

    if (!dragRef.current.moved) {
      setTimeout(() => navigate('/state'), 300)
    }
  }

  return (
    <div style={styles.container}>
      <DecoShapes />

      <button style={styles.backBtn} onClick={() => navigate('/')}>
        ‹ {t.back}
      </button>

      <h1 style={styles.title}>{t.chooseLanguage}</h1>

      <div
        style={{ ...styles.pickerOuter, cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={e => { e.preventDefault(); onDragMove(e) }}
        onTouchEnd={onDragEnd}
      >
        {/* Center highlight */}
        <div style={styles.centerBar} />

        {/* Top fade */}
        <div style={styles.gradTop} />
        {/* Bottom fade */}
        <div style={styles.gradBottom} />

        {/* Sliding track */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            transform: `translateY(${trackY}px)`,
            transition: isSnapping ? 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
            userSelect: 'none',
          }}
        >
          {LANGUAGES.map((lang, i) => {
            const dist = Math.abs(i - centeredIdx)
            return (
              <div
                key={lang}
                style={{
                  height: ITEM_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: dist === 0 ? 30 : dist === 1 ? 22 : 17,
                  fontWeight: dist === 0 ? 700 : 500,
                  color: dist === 0 ? '#2A2720' : dist === 1 ? '#7A7570' : '#C8C3BE',
                  opacity: dist >= 2 ? 0.6 : 1,
                  transition: 'font-size 0.15s, color 0.15s, opacity 0.15s',
                  fontFamily: 'var(--font)',
                  pointerEvents: 'none',
                }}
              >
                {lang}
              </div>
            )
          })}
        </div>
      </div>

      <p style={styles.hint}>tap to select · drag to scroll</p>
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
  pickerOuter: {
    position: 'relative',
    width: 380,
    height: ITEM_HEIGHT * VISIBLE,
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(12px)',
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,0.6)',
    zIndex: 2,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',
  },
  centerBar: {
    position: 'absolute',
    top: HALF * ITEM_HEIGHT,
    left: 16,
    right: 16,
    height: ITEM_HEIGHT,
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  gradTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HALF * ITEM_HEIGHT,
    background: 'linear-gradient(to bottom, rgba(250,248,242,0.92) 0%, transparent 100%)',
    pointerEvents: 'none',
    zIndex: 3,
  },
  gradBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HALF * ITEM_HEIGHT,
    background: 'linear-gradient(to top, rgba(250,248,242,0.92) 0%, transparent 100%)',
    pointerEvents: 'none',
    zIndex: 3,
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    color: '#ADA9A4',
    fontFamily: 'var(--font)',
    zIndex: 2,
    letterSpacing: '0.03em',
  },
}
