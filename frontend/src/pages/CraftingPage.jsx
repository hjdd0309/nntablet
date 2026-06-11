import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useT } from '../i18n'

const STEP_IMAGES = {
  1: '/스텝1.jpg',
  2: '/스텝2.jpg',
  3: ['/스텝3_1.jpg', '/스텝3_2.jpg', '/스텝3_3.jpg'],
  4: '/스텝4.jpg',
  5: '/스텝5.jpg',
  6: '/스텝6.jpg',
  7: '/스텝7.jpg',
}

const GLAZE_COLORS = [
  { id: 'pink',   color: '#D4B8B0' },
  { id: 'peach',  color: '#C8B8A8' },
  { id: 'yellow', color: '#C0B8A0' },
  { id: 'teal',   color: '#B0B8B8' },
  { id: 'purple', color: '#B8B0C8' },
]

export default function CraftingPage() {
  const navigate = useNavigate()
  const t = useT()
  const [craftStep, setCraftStep] = useState(1)
  const [selectedColor, setSelectedColor] = useState(null)
  const totalSteps = 7

  const handleNext = () => {
    if (craftStep < totalSteps) {
      setCraftStep(s => s + 1)
    } else {
      navigate('/package')
    }
  }

  const handlePrev = () => {
    setCraftStep(s => s - 1)
  }

  const isColorStep = craftStep === 2

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/5_배경.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/gallery" showCall showHome />
      <StepProgress currentStep={4} />

      <div style={styles.content}>
        <h2 style={styles.stepHeading}>
          <span style={styles.stepNum}>Step {craftStep}.&nbsp;</span>
          <span style={styles.stepDesc}>{t.craftSteps[craftStep - 1]}</span>
        </h2>

        <div style={styles.imageBox}>
          {/* 스텝 이미지 */}
          {Array.isArray(STEP_IMAGES[craftStep]) ? (
            <div style={styles.multiImgRow}>
              {STEP_IMAGES[craftStep].map((src, i) => (
                <img key={i} src={src} alt={`step ${craftStep}-${i + 1}`} style={styles.stepImgMulti} />
              ))}
            </div>
          ) : STEP_IMAGES[craftStep] ? (
            <img src={STEP_IMAGES[craftStep]} alt={`step ${craftStep}`} style={styles.stepImg} />
          ) : null}

          {/* 색상 선택 (스텝2) */}
          {isColorStep && (
            <div style={styles.colorOverlay}>
              <div style={styles.colorRow}>
                {GLAZE_COLORS.map((g, i) => (
                  <div key={g.id} style={styles.colorItem}>
                    {i === 0 && <span style={styles.colorBadge}>{t.craftBest}</span>}
                    {i === 1 && <span style={styles.colorBadge}>{t.craftArtisanPick}</span>}
                    {i > 1 && <span style={styles.colorBadgeEmpty} />}
                    <button
                      style={{
                        ...styles.colorCircle,
                        background: g.color,
                        ...(selectedColor === g.id ? styles.colorCircleSelected : {}),
                      }}
                      onClick={() => setSelectedColor(g.id)}
                    />
                    <span style={styles.colorLabel}>color</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {craftStep >= 2 && (
            <button style={styles.prevBtn} onClick={handlePrev}>←</button>
          )}
          <button style={styles.nextBtn} onClick={handleNext}>→</button>
        </div>
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
    padding: '12px 40px 32px',
    gap: 16,
    zIndex: 2,
    overflow: 'hidden',
  },
  stepHeading: {
    fontSize: 22,
    fontWeight: 400,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    flexShrink: 0,
  },
  stepNum: {
    fontWeight: 800,
  },
  stepDesc: {
    fontWeight: 600,
  },
  imageBox: {
    flex: 1,
    background: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: 20,
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stepImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },
  multiImgRow: {
    display: 'flex',
    gap: 8,
    width: '100%',
    height: '100%',
    padding: 8,
    boxSizing: 'border-box',
  },
  stepImgMulti: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    objectFit: 'contain',
    borderRadius: 10,
  },
  colorOverlay: {
    position: 'absolute',
    bottom: 72,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  colorRow: {
    display: 'flex',
    gap: 24,
    alignItems: 'flex-end',
    justifyContent: 'center',
    pointerEvents: 'auto',
    background: 'rgba(250,248,242,0.85)',
    backdropFilter: 'blur(6px)',
    borderRadius: 20,
    padding: '12px 24px',
  },
  colorItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  colorBadge: {
    fontSize: 12,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    height: 18,
    whiteSpace: 'nowrap',
  },
  colorBadgeEmpty: {
    height: 18,
    display: 'block',
  },
  colorCircle: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'transform 0.15s, border-color 0.15s',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  },
  colorCircleSelected: {
    border: '2px solid #2A2720',
    transform: 'scale(1.08)',
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#7A7570',
    fontFamily: 'var(--font)',
  },
  nextBtn: {
    position: 'absolute',
    bottom: 20,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: '1.5px solid #2A2720',
    background: 'rgba(255,255,255,0.8)',
    fontSize: 22,
    color: '#2A2720',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  prevBtn: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: '1.5px solid #2A2720',
    background: 'rgba(255,255,255,0.8)',
    fontSize: 22,
    color: '#2A2720',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
}
