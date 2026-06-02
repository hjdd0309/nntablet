import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useApp } from '../context/AppContext'

const PALETTE = [
  { id: 'pink', color: '#E87080' },
  { id: 'peach', color: '#E8A078' },
  { id: 'yellow', color: '#F0D870' },
  { id: 'teal', color: '#78C8C0' },
  { id: 'purple', color: '#8878C8' },
  { id: 'lavender', color: '#C0B0D8' },
  { id: 'salmon', color: '#E8A0A0' },
  { id: 'gray', color: '#C8C4C0' },
]

const TOOLS = [
  { id: 'brush', icon: '🖌' },
  { id: 'eraser', icon: '◻' },
  { id: 'lasso', icon: '⬚' },
  { id: 'fill', icon: '⊕' },
]

export default function SketchingPage() {
  const navigate = useNavigate()
  const { selectedDesign, setSketchColor } = useApp()
  const canvasRef = useRef(null)
  const [selectedTool, setSelectedTool] = useState('brush')
  const [selectedColor, setSelectedColor] = useState(PALETTE[0].color)
  const [isDrawing, setIsDrawing] = useState(false)
  const [fillColor, setFillColor] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const lastPos = useRef(null)

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const drawGatOutline = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    if (fillColor) {
      ctx.fillStyle = fillColor
      ctx.beginPath()
      ctx.rect(w * 0.3, h * 0.05, w * 0.4, h * 0.6)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(w * 0.5, h * 0.72, w * 0.44, h * 0.16, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.strokeStyle = '#2A2720'
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    // Hat body
    ctx.beginPath()
    ctx.rect(w * 0.3, h * 0.05, w * 0.4, h * 0.6)
    ctx.stroke()
    // Brim
    ctx.beginPath()
    ctx.ellipse(w * 0.5, h * 0.72, w * 0.44, h * 0.16, 0, 0, Math.PI * 2)
    ctx.stroke()
  }, [fillColor])

  const drawRectOutline = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    if (fillColor) {
      ctx.fillStyle = fillColor
      ctx.beginPath()
      ctx.rect(w * 0.15, h * 0.1, w * 0.7, h * 0.8)
      ctx.fill()
    }
    ctx.strokeStyle = '#2A2720'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.rect(w * 0.15, h * 0.1, w * 0.7, h * 0.8)
    ctx.stroke()
  }, [fillColor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (selectedDesign === 'rectangle') {
      drawRectOutline(ctx, canvas.width, canvas.height)
    } else {
      drawGatOutline(ctx, canvas.width, canvas.height)
    }
  }, [selectedDesign, drawGatOutline, drawRectOutline])

  const startDraw = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    if (selectedTool === 'fill') {
      setFillColor(selectedColor)
      setSketchColor(selectedColor)
      return
    }
    setIsDrawing(true)
    lastPos.current = getPos(e, canvas)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)

    ctx.globalCompositeOperation = selectedTool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = selectedColor
    ctx.lineWidth = selectedTool === 'eraser' ? 20 : 8
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    ctx.globalCompositeOperation = 'source-over'

    lastPos.current = pos
  }

  const endDraw = () => setIsDrawing(false)

  return (
    <div style={styles.container}>
      <div style={styles.bgGradient} />
      <Header showBack backTo="/choose-design" />
      <StepProgress currentStep={2} />

      <h1 style={styles.title}>Prepare your design</h1>

      <div style={styles.workspace}>
        {/* Left tools */}
        <div style={styles.toolPanel}>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              style={{...styles.toolBtn, ...(selectedTool === t.id ? styles.toolBtnActive : {})}}
              onClick={() => setSelectedTool(t.id)}
            >
              <span style={{ fontSize: 20 }}>{t.icon}</span>
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div style={styles.canvasWrap}>
          <canvas
            ref={canvasRef}
            width={660}
            height={460}
            style={styles.canvas}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>

        {/* Right palette */}
        <div style={styles.palette}>
          <button style={styles.nextBtn} onClick={() => setShowConfirm(true)}>→</button>
          <div style={styles.bookmarkBtn}>🔖</div>
          <div style={styles.colorGrid}>
            {PALETTE.map((p) => (
              <button
                key={p.id}
                style={{
                  ...styles.colorSwatch,
                  background: p.color,
                  ...(selectedColor === p.color ? styles.colorSwatchActive : {}),
                }}
                onClick={() => setSelectedColor(p.color)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Design confirm modal */}
      {showConfirm && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowConfirm(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <button style={styles.modalBack} onClick={() => setShowConfirm(false)}>‹</button>
              <span style={styles.modalTitle}>Check your design</span>
              <button style={styles.modalClose} onClick={() => setShowConfirm(false)}>✕</button>
            </div>
            <p style={styles.modalSub}>Is your design ready?</p>
            <div style={styles.previewWrap}>
              <canvas
                style={styles.previewCanvas}
                ref={(el) => {
                  if (!el || !canvasRef.current) return
                  const ctx = el.getContext('2d')
                  ctx.drawImage(canvasRef.current, 0, 0, el.width, el.height)
                }}
                width={380}
                height={320}
              />
            </div>
            <div style={styles.modalBtns}>
              <button style={styles.btnNo} onClick={() => setShowConfirm(false)}>No, try again</button>
              <button style={styles.btnYes} onClick={() => navigate('/process-log')}>Yes, I'm ready</button>
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
    background: '#FAF8F2',
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
    height: '55%',
    background: 'radial-gradient(ellipse at top center, rgba(200,196,230,0.6) 0%, transparent 70%)',
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
  workspace: {
    flex: 1,
    display: 'flex',
    alignItems: 'stretch',
    gap: 0,
    padding: '0 16px 16px',
    overflow: 'hidden',
    zIndex: 2,
  },
  toolPanel: {
    width: 68,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '12px 8px',
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(8px)',
    borderRadius: 16,
    alignItems: 'center',
    flexShrink: 0,
  },
  toolBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'none',
    border: '1px solid rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#7A7570',
  },
  toolBtnActive: {
    background: 'rgba(248,203,127,0.4)',
    border: '1px solid rgba(232,146,78,0.5)',
    color: '#2A2720',
  },
  canvasWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 12px',
    background: 'rgba(248,246,240,0.6)',
    margin: '0 12px',
    borderRadius: 16,
    overflow: 'hidden',
  },
  canvas: {
    borderRadius: 8,
    cursor: 'crosshair',
    touchAction: 'none',
    maxWidth: '100%',
    maxHeight: '100%',
    background: '#F8F6F0',
  },
  palette: {
    width: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '12px 8px',
    flexShrink: 0,
  },
  nextBtn: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '2px solid #2A2720',
    background: 'none',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    marginBottom: 4,
  },
  bookmarkBtn: {
    fontSize: 22,
    cursor: 'pointer',
  },
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    marginTop: 8,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'transform 0.15s',
  },
  colorSwatchActive: {
    border: '2px solid #2A2720',
    transform: 'scale(1.2)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    width: 760,
    background: 'linear-gradient(160deg, #EEF0F8 0%, #DDE0F0 100%)',
    borderRadius: 28,
    padding: '28px 36px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    boxShadow: '0 12px 48px rgba(0,0,0,0.22)',
  },
  modalHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2A2720',
    flex: 1,
    textAlign: 'center',
  },
  modalBack: {
    fontSize: 28,
    color: '#2A2720',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: 40,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '2px solid #2A2720',
    background: 'none',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontWeight: 700,
  },
  modalSub: {
    fontSize: 14,
    color: '#7A7570',
  },
  previewWrap: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    padding: 16,
  },
  previewCanvas: {
    borderRadius: 8,
    background: 'rgba(255,255,255,0.2)',
  },
  modalBtns: {
    display: 'flex',
    gap: 20,
    width: '100%',
  },
  btnNo: {
    flex: 1,
    padding: '16px',
    borderRadius: 30,
    background: 'rgba(255,255,255,0.6)',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  btnYes: {
    flex: 1,
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
}
