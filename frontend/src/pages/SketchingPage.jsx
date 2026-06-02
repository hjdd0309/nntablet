import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'

const PALETTE = [
  '#E87080', '#E8A078', '#F0D870', '#78C8C0',
  '#8878C8', '#C0B0D8', '#E8A0A0', '#C8C4C0',
]

const CANVAS_W = 660
const CANVAS_H = 460

// SVG tool icons — look like real tools
function BrushIcon({ active }) {
  const c = active ? '#2A2720' : '#9A9590'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M14 2L19.5 7.5L9 18C8 19 6.5 19.5 5 19C4.5 17.5 5 16 6 15L14 2Z"
        stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 4L17.5 9.5" stroke={c} strokeWidth="1.5"/>
      <circle cx="5" cy="19" r="2" fill={active ? '#E87080' : '#C8C4C0'}/>
    </svg>
  )
}

function EraserIcon({ active }) {
  const c = active ? '#2A2720' : '#9A9590'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="8" width="15" height="9" rx="2"
        fill={active ? '#FADADD' : '#F0EDEA'}
        stroke={c} strokeWidth="1.5"/>
      <rect x="2" y="8" width="6" height="9" rx="2"
        fill={active ? '#E8A0A8' : '#D8D4D0'}/>
      <line x1="2" y1="17" x2="17" y2="17" stroke={c} strokeWidth="1.5"/>
    </svg>
  )
}

function FillIcon({ active }) {
  const c = active ? '#2A2720' : '#9A9590'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M15.5 13.5C15.5 15 14 16 13 16C12 16 10.5 15 10.5 13.5C10.5 12 13 10 13 10C13 10 15.5 12 15.5 13.5Z"
        fill={active ? '#78C8C0' : '#B0D8D4'} stroke={c} strokeWidth="1.2"/>
      <path d="M8 3L13 8L6 15L1.5 10.5L8 3Z"
        fill={active ? 'rgba(42,39,32,0.12)' : 'rgba(42,39,32,0.06)'}
        stroke={c} strokeWidth="1.5" strokeLinejoin="round" transform="translate(1,1)"/>
      <path d="M14 9L19 4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

const TOOLS = [
  { id: 'brush', Icon: BrushIcon },
  { id: 'eraser', Icon: EraserIcon },
  { id: 'fill', Icon: FillIcon },
]

function drawShape(ctx, design, w, h) {
  ctx.strokeStyle = '#2A2720'
  ctx.lineWidth = 3
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  if (design === 'gat') {
    const bx  = w * 0.3   // body left
    const bx2 = w * 0.7   // body right
    const by  = h * 0.05  // body top
    const cx  = w * 0.5   // brim center x
    const cy  = h * 0.72  // brim center y
    const rx  = w * 0.44  // brim x-radius
    const ry  = h * 0.16  // brim y-radius

    // Y where the hat body sides meet the top arc of the brim ellipse
    const normDx2 = ((bx - cx) / rx) ** 2
    const intersectY = cy - ry * Math.sqrt(1 - normDx2)

    // Angles where the hat body sides meet the top of the brim
    const θRight = Math.atan2((intersectY - cy) / ry, (bx2 - cx) / rx)
    const θLeft  = Math.atan2((intersectY - cy) / ry, (bx  - cx) / rx)

    // Draw everything as ONE continuous path so crown and brim connect cleanly
    ctx.beginPath()
    ctx.moveTo(bx, by)           // top-left of crown
    ctx.lineTo(bx2, by)          // top edge →
    ctx.lineTo(bx2, intersectY)  // right side ↓ down to brim junction
    ctx.ellipse(cx, cy, rx, ry, 0, θRight, θLeft, false) // brim arc (clockwise, through bottom)
    ctx.lineTo(bx, by)           // left side ↑ back to top-left
    ctx.stroke()

  } else {
    ctx.beginPath()
    ctx.rect(w * 0.15, h * 0.1, w * 0.7, h * 0.8)
    ctx.stroke()
  }
}

function fillShape(ctx, design, w, h, color) {
  ctx.fillStyle = color
  if (design === 'gat') {
    ctx.beginPath()
    ctx.rect(w * 0.3, h * 0.05, w * 0.4, h * 0.6)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(w * 0.5, h * 0.72, w * 0.44, h * 0.16, 0, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.rect(w * 0.15, h * 0.1, w * 0.7, h * 0.8)
    ctx.fill()
  }
}

export default function SketchingPage() {
  const navigate = useNavigate()
  const { selectedDesign, setSketchColor } = useApp()
  const t = useT()

  // Two canvas layers: outline (fixed) + drawing (user)
  const outlineCanvasRef = useRef(null)
  const drawCanvasRef = useRef(null)

  const [selectedTool, setSelectedTool] = useState('brush')
  const [selectedColor, setSelectedColor] = useState(PALETTE[0])
  const [isDrawing, setIsDrawing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const lastPos = useRef(null)

  // Draw fixed outline on mount / design change — never touched by eraser
  useEffect(() => {
    const canvas = outlineCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawShape(ctx, selectedDesign, canvas.width, canvas.height)
  }, [selectedDesign])

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const startDraw = (e) => {
    e.preventDefault()
    const canvas = drawCanvasRef.current
    if (!canvas) return

    if (selectedTool === 'fill') {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      fillShape(ctx, selectedDesign, canvas.width, canvas.height, selectedColor)
      setSketchColor(selectedColor)
      return
    }

    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDrawing(true)
    lastPos.current = getPos(e, canvas)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = drawCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)

    ctx.globalCompositeOperation = selectedTool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = selectedColor
    ctx.lineWidth = selectedTool === 'eraser' ? 28 : 8
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

  const cursorStyle = selectedTool === 'eraser' ? 'cell' : 'crosshair'

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bg-blue.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/choose-design" showCall showHome />
      <StepProgress currentStep={3} />

      <h1 style={styles.title}>{t.prepareYourDesign}</h1>

      <div style={styles.workspace}>
        {/* Left tools */}
        <div style={styles.toolPanel}>
          {TOOLS.map(({ id, Icon }) => (
            <button
              key={id}
              style={{ ...styles.toolBtn, ...(selectedTool === id ? styles.toolBtnActive : {}) }}
              onClick={() => setSelectedTool(id)}
            >
              <Icon active={selectedTool === id} />
            </button>
          ))}
        </div>

        {/* Canvas — two layers stacked */}
        <div style={styles.canvasWrap}>
          <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%', lineHeight: 0 }}>
            {/* Bottom: fixed outline, never erased */}
            <canvas
              ref={outlineCanvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              style={{ ...styles.canvas, display: 'block' }}
            />
            {/* Top: user drawing layer */}
            <canvas
              ref={drawCanvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              style={{ ...styles.canvas, background: 'transparent', position: 'absolute', top: 0, left: 0, cursor: cursorStyle, touchAction: 'none' }}
              onPointerDown={startDraw}
              onPointerMove={draw}
              onPointerUp={endDraw}
              onPointerCancel={endDraw}
            />
          </div>
        </div>

        {/* Right palette */}
        <div style={styles.palette}>
          <button style={styles.nextBtn} onClick={() => setShowConfirm(true)}>→</button>
          <div style={styles.bookmarkBtn}>🔖</div>
          <div style={styles.colorGrid}>
            {PALETTE.map((color) => (
              <button
                key={color}
                style={{
                  ...styles.colorSwatch,
                  background: color,
                  ...(selectedColor === color ? styles.colorSwatchActive : {}),
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowConfirm(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <button style={styles.modalBack} onClick={() => setShowConfirm(false)}>‹</button>
              <span style={styles.modalTitle}>{t.checkYourDesign}</span>
              <button style={styles.modalClose} onClick={() => setShowConfirm(false)}>✕</button>
            </div>
            <p style={styles.modalSub}>{t.isDesignReady}</p>
            <div style={styles.previewWrap}>
              <canvas
                style={styles.previewCanvas}
                ref={(el) => {
                  if (!el) return
                  const outline = outlineCanvasRef.current
                  const drawing = drawCanvasRef.current
                  if (!outline || !drawing) return
                  const ctx = el.getContext('2d')
                  ctx.clearRect(0, 0, el.width, el.height)
                  ctx.drawImage(outline, 0, 0, el.width, el.height)
                  ctx.drawImage(drawing, 0, 0, el.width, el.height)
                }}
                width={380}
                height={280}
              />
            </div>
            <div style={styles.modalBtns}>
              <button style={styles.btnNo} onClick={() => setShowConfirm(false)}>{t.noTryAgainSketch}</button>
              <button style={styles.btnYes} onClick={() => navigate('/crafting')}>{t.yesImReady}</button>
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
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
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
    background: 'rgba(255,255,255,0.75)',
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
    border: '1.5px solid rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  toolBtnActive: {
    background: 'rgba(248,203,127,0.35)',
    border: '1.5px solid rgba(232,146,78,0.5)',
  },
  canvasWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 12px',
    background: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(4px)',
    margin: '0 12px',
    borderRadius: 16,
    overflow: 'hidden',
  },
  canvas: {
    borderRadius: 8,
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
    background: '#F8F6F0',
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
