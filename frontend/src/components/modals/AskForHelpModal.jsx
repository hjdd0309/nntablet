import { useState, useEffect } from 'react'
import { useT } from '../../i18n'

const DEMO_TRANSLATION = "Please check if the message has been translated accurately...."

export default function AskForHelpModal({ onClose }) {
  const t = useT()
  const [step, setStep] = useState('role') // role | owner-questions | guest-translating | guest-listening | guest-confirm | other-questions
  const [typedText, setTypedText] = useState('')
  const [isListening, setIsListening] = useState(false)

  // Typewriter effect for translation
  useEffect(() => {
    if (step !== 'guest-translating') return
    setTypedText('')
    let i = 0
    const interval = setInterval(() => {
      if (i <= DEMO_TRANSLATION.length) {
        setTypedText(DEMO_TRANSLATION.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 45)
    return () => clearInterval(interval)
  }, [step])

  const handleMicClick = () => {
    if (step === 'guest-translating') {
      setStep('guest-listening')
      setTimeout(() => setStep('guest-confirm'), 2500)
    } else if (step === 'guest-listening') {
      setStep('guest-confirm')
    } else if (step === 'other-questions') {
      setIsListening(!isListening)
    }
  }

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.modalHeader}>
          {step !== 'role' && (
            <button style={styles.backBtn} onClick={() => setStep('role')}>
              ‹
            </button>
          )}
          <span style={styles.title}>{t.askForHelpTitle}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Role selection */}
        {step === 'role' && (
          <>
            <p style={styles.subtitle}>{t.selectRoleSubtitle}</p>
            <div style={styles.cardRow}>
              <button style={styles.roleCard} onClick={() => setStep('owner-questions')}>
                <span style={styles.cardArrow}>→</span>
                <span style={styles.cardLabel}>{t.imOwner.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</span>
              </button>
              <button style={{...styles.roleCard, ...styles.roleCardActive}} onClick={() => setStep('guest-translating')}>
                <span style={styles.cardArrow}>→</span>
                <span style={styles.cardLabel}>{t.imGuest.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</span>
              </button>
            </div>
            <button style={styles.otherBtn} onClick={() => setStep('other-questions')}>
              <span style={styles.micCircle}>🎤</span>
              <span style={styles.otherLabel}>{t.otherQuestions}</span>
            </button>
          </>
        )}

        {/* Owner: common questions */}
        {step === 'owner-questions' && (
          <>
            <p style={styles.subtitle}>{t.selectQuestionSubtitle}</p>
            <div style={styles.questionsGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <button key={i} style={{...styles.questionCard, ...(i === 0 ? styles.questionCardSelected : {})}}>
                  <div style={styles.questionFace}>😞</div>
                  <span style={styles.questionText}>{t.ownerQuestion}</span>
                </button>
              ))}
            </div>
            <button style={styles.otherBtn} onClick={() => setStep('other-questions')}>
              <span style={styles.micCircle}>🎤</span>
              <span style={styles.otherLabel}>{t.otherQuestions}</span>
            </button>
          </>
        )}

        {/* Guest: translation in progress */}
        {step === 'guest-translating' && (
          <>
            <p style={styles.subtitle}>{t.checkTranslationSubtitle}</p>
            <div style={styles.translationCard}>
              <p style={styles.translationText}>
                {typedText.length > 0 ? (
                  <>
                    {typedText.slice(0, -10)}
                    <span style={{ color: '#ADA9A4' }}>{typedText.slice(-10)}</span>
                  </>
                ) : null}
              </p>
            </div>
            <button style={styles.micBtn} onClick={handleMicClick}>
              <span style={styles.micIcon}>🎤</span>
            </button>
          </>
        )}

        {/* Guest: listening */}
        {step === 'guest-listening' && (
          <>
            <p style={styles.subtitle}>{t.checkTranslationSubtitle}</p>
            <div style={styles.translationCard}>
              <p style={{...styles.translationText, color: '#7A7570'}}>{t.listeningText}</p>
            </div>
            <button style={{...styles.micBtn, ...styles.micBtnActive}}>
              <span style={styles.micIcon}>🎤</span>
            </button>
          </>
        )}

        {/* Guest: confirm */}
        {step === 'guest-confirm' && (
          <>
            <p style={styles.subtitle}>{t.didIGetRight}</p>
            <div style={styles.translationCard}>
              <p style={styles.translationText}>{DEMO_TRANSLATION}</p>
            </div>
            <div style={styles.confirmBtns}>
              <button style={styles.confirmBtnNo} onClick={() => setStep('guest-translating')}>
                <span style={styles.micSmall}>🎤</span> {t.noTryAgain}
              </button>
              <button style={styles.confirmBtnYes} onClick={onClose}>
                <span style={styles.micSmall}>🎤</span> {t.yesThatRight}
              </button>
            </div>
          </>
        )}

        {/* Other questions (voice) */}
        {step === 'other-questions' && (
          <>
            <p style={styles.subtitle}>{t.speakClearly}</p>
            <div style={styles.translationCard}>
              <p style={{...styles.translationText, color: '#7A7570'}}>
                {isListening ? t.listeningText : t.tapMic}
              </p>
            </div>
            <button
              style={{...styles.micBtn, ...(isListening ? styles.micBtnActive : {})}}
              onClick={handleMicClick}
            >
              <span style={styles.micIcon}>🎤</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    width: 900,
    background: 'linear-gradient(160deg, #FAF6EE 0%, #F5E8D0 40%, #EFD4A8 100%)',
    borderRadius: 28,
    padding: '28px 36px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    boxShadow: '0 12px 48px rgba(0,0,0,0.22)',
    position: 'relative',
  },
  modalHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2A2720',
    flex: 1,
    textAlign: 'center',
  },
  backBtn: {
    fontSize: 28,
    color: '#2A2720',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: 40,
    lineHeight: 1,
    marginTop: -4,
  },
  closeBtn: {
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
    color: '#2A2720',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A7570',
    textAlign: 'center',
    marginTop: -8,
  },
  cardRow: {
    display: 'flex',
    gap: 20,
    width: '100%',
  },
  roleCard: {
    flex: 1,
    height: 200,
    background: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '20px 24px',
    cursor: 'pointer',
    transition: 'transform 0.15s',
  },
  roleCardActive: {
    background: 'linear-gradient(135deg, rgba(248,203,127,0.6) 0%, rgba(232,146,78,0.5) 100%)',
  },
  cardArrow: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '1.5px solid #2A2720',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    alignSelf: 'flex-end',
  },
  cardLabel: {
    fontSize: 26,
    fontWeight: 700,
    color: '#2A2720',
    textAlign: 'left',
    lineHeight: 1.3,
    marginTop: 'auto',
    paddingBottom: 8,
  },
  otherBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.5)',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: 40,
    padding: '14px 32px',
    cursor: 'pointer',
    fontSize: 17,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    backdropFilter: 'blur(8px)',
  },
  micCircle: {
    fontSize: 20,
  },
  otherLabel: {},
  questionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    width: '100%',
  },
  questionCard: {
    background: 'rgba(255,255,255,0.45)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: 14,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontFamily: 'var(--font)',
  },
  questionCardSelected: {
    background: 'rgba(210,205,200,0.5)',
  },
  questionFace: {
    fontSize: 22,
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'rgba(180,175,170,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 12,
    fontWeight: 600,
    color: '#2A2720',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  translationCard: {
    width: '100%',
    minHeight: 140,
    background: 'rgba(255,255,255,0.45)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: 20,
    padding: '28px 32px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  translationText: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2A2720',
    lineHeight: 1.5,
  },
  micBtn: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(210,205,200,0.5)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 26,
    transition: 'all 0.2s',
  },
  micBtnActive: {
    background: 'linear-gradient(135deg, #F8CB7F, #E8924E)',
    boxShadow: '0 4px 20px rgba(232,146,78,0.5)',
    animation: 'pulse 1s ease-in-out infinite',
  },
  micIcon: {
    fontSize: 28,
  },
  confirmBtns: {
    display: 'flex',
    gap: 16,
    width: '100%',
  },
  confirmBtnNo: {
    flex: 1,
    padding: '16px',
    borderRadius: 30,
    background: 'rgba(255,255,255,0.5)',
    border: '1px solid rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    fontFamily: 'var(--font)',
  },
  confirmBtnYes: {
    flex: 1,
    padding: '16px',
    borderRadius: 30,
    background: 'rgba(210,205,200,0.5)',
    border: '1px solid rgba(210,205,200,0.7)',
    fontSize: 15,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    fontFamily: 'var(--font)',
  },
  micSmall: {
    fontSize: 16,
  },
}
