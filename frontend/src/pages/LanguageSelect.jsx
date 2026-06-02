import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'

const LANGUAGES = ['Español', 'English', '한국어', 'にほんご', '汉语']
const ITEM_HEIGHT = 64
const VISIBLE = 5
const HALF = Math.floor(VISIBLE / 2)


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

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsSnapping(false)
    setIsDragging(true)
    dragRef.current = { active: true, startY: e.clientY, lastDelta: 0, moved: false }
  }

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return
    const delta = e.clientY - dragRef.current.startY
    dragRef.current.lastDelta = delta
    if (Math.abs(delta) > 5) dragRef.current.moved = true
    setDragDelta(delta)
  }

  const onPointerUp = () => {
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
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/bg-flowers.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />

      <button style={styles.backBtn} onClick={() => navigate('/')}>
        ‹ {t.back}
      </button>

      <h1 style={styles.title}>{t.chooseLanguage}</h1>

      <div
        style={{ ...styles.pickerOuter, cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
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
