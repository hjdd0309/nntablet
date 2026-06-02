import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useT } from '../i18n'

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
  const totalSteps = 8

  const handleNext = () => {
    if (craftStep < totalSteps) {
      setCraftStep(s => s + 1)
    } else {
      navigate('/package')
    }
  }

  const isColorStep = craftStep === 2

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bg-white.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/sketch" showCall showCamera showHome />
      <StepProgress currentStep={4} />

      <div style={styles.content}>
        <h2 style={styles.stepHeading}>
          <span style={styles.stepNum}>Step {craftStep}.&nbsp;</span>
          <span style={styles.stepDesc}>{t.craftSteps[craftStep - 1]}</span>
        </h2>

        <div style={styles.imageBox}>
          {isColorStep ? (
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
          ) : null}

          <button style={styles.nextBtn} onClick={handleNext}>
            →
          </button>
        </div>
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
  colorRow: {
    display: 'flex',
    gap: 24,
    alignItems: 'flex-end',
    justifyContent: 'center',
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
}
