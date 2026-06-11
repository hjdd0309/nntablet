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

export default function CraftingPage() {
  const navigate = useNavigate()
  const t = useT()
  const [craftStep, setCraftStep] = useState(1)
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
          {/* 스텝별 안내 문구 - 절대 위치로 상단 중앙 */}
          {(craftStep === 2 || craftStep === 4) && (
            <div style={styles.step2Notice}>
              <p style={styles.step2NoticeText}>
                {craftStep === 2 ? t.colorNotice : t.step4Notice}
              </p>
            </div>
          )}

          {/* 스텝 이미지 */}
          {Array.isArray(STEP_IMAGES[craftStep]) ? (
            <div style={styles.multiImgRow}>
              {STEP_IMAGES[craftStep].map((src, i) => (
                <div key={i} style={styles.stepImgCardWrap}>
                  <p style={styles.stepImgCaption}>{t.step3Captions[i]}</p>
                  <div style={styles.stepImgCard}>
                    <img src={src} alt={`step ${craftStep}-${i + 1}`} style={styles.stepImgMulti} />
                  </div>
                </div>
              ))}
            </div>
          ) : STEP_IMAGES[craftStep] ? (
            <img
              src={STEP_IMAGES[craftStep]}
              alt={`step ${craftStep}`}
              style={{
                ...styles.stepImg,
                ...((craftStep === 2 || craftStep === 4)
                  ? { position: 'absolute', top: '58%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0, maxWidth: '76%', maxHeight: '70%' }
                  : { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 }),
              }}
            />
          ) : null}

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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    overflow: 'hidden',
    padding: '16px',
  },
  stepImg: {
    maxWidth: '92%',
    maxHeight: '88%',
    objectFit: 'contain',
    display: 'block',
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    margin: 'auto',
  },
  multiImgRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    padding: '4px 8px 64px',
    boxSizing: 'border-box',
    alignItems: 'flex-start',
  },
  stepImgCardWrap: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  stepImgCaption: {
    fontSize: 15,
    fontWeight: 600,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    margin: 0,
    textAlign: 'center',
    flexShrink: 0,
  },
  stepImgCard: {
    width: '100%',
    aspectRatio: '4 / 3',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  },
  stepImgMulti: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  step2Notice: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  step2NoticeText: {
    fontSize: 20,
    fontWeight: 600,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    margin: 0,
    textAlign: 'center',
    whiteSpace: 'nowrap',
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
