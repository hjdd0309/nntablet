import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { useT } from '../../i18n'

const LANG_CONFIG = {
  'English':  { api: 'en', speech: 'en-US' },
  '한국어':   { api: 'ko', speech: 'ko-KR' },
  'Español':  { api: 'es', speech: 'es-ES' },
  'にほんご': { api: 'ja', speech: 'ja-JP' },
  '汉语':     { api: 'zh', speech: 'zh-CN' },
}

async function fetchTranslation(text, from, to) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
  const res = await fetch(url)
  const data = await res.json()
  if (data.responseStatus === 200) return data.responseData.translatedText
  throw new Error('Translation failed')
}

export default function AskForHelpModal({ onClose }) {
  const t = useT()
  const { language } = useApp()
  const [step, setStep] = useState(() => language === '한국어' ? 'role' : 'guest-input')
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState('')
  const recRef = useRef(null)

  const cfg = LANG_CONFIG[language] || LANG_CONFIG['English']
  const srcCode = cfg.api
  const tgtCode = 'ko'
  const isKorean = srcCode === 'ko'

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setError(t.speechNotSupported); return }
    const rec = new SR()
    rec.lang = cfg.speech
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (e) => {
      setInputText(prev => prev + e.results[0][0].transcript)
      setIsListening(false)
    }
    rec.onerror = () => setIsListening(false)
    rec.onend = () => setIsListening(false)
    recRef.current = rec
    rec.start()
    setIsListening(true)
  }

  const stopListening = () => {
    recRef.current?.stop()
    setIsListening(false)
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return
    setIsTranslating(true)
    setError('')
    try {
      const result = await fetchTranslation(inputText.trim(), srcCode, tgtCode)
      setTranslatedText(result)
      setStep('guest-result')
    } catch {
      setError(t.translationError)
    } finally {
      setIsTranslating(false)
    }
  }

  const resetGuest = () => {
    setInputText('')
    setTranslatedText('')
    setError('')
    setIsListening(false)
    setStep('guest-input')
  }

  const goBack = () => {
    if (step === 'guest-result') { resetGuest(); return }
    if (isKorean) setStep('role')
    else onClose()
  }

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {/* Modal header */}
        <div style={styles.modalHeader}>
          {step !== 'role' && (
            <button style={styles.backBtn} onClick={goBack}>‹</button>
          )}
          <span style={styles.title}>{t.askForHelpTitle}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* ── Role selection ── */}
        {step === 'role' && (
          <>
            <p style={styles.subtitle}>{t.selectRoleSubtitle}</p>
            <div style={styles.cardRow}>
              <button style={styles.roleCard} onClick={() => setStep('owner-questions')}>
                <span style={styles.cardArrow}>→</span>
                <span style={styles.cardLabel}>
                  {t.imOwner.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
                </span>
              </button>
              <button style={{ ...styles.roleCard, ...styles.roleCardActive }} onClick={() => setStep('guest-input')}>
                <span style={styles.cardArrow}>→</span>
                <span style={styles.cardLabel}>
                  {t.imGuest.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
                </span>
              </button>
            </div>
            <button style={styles.otherBtn} onClick={() => setStep('other-questions')}>
              <span style={styles.micCircle}>🎤</span>
              <span>{t.otherQuestions}</span>
            </button>
          </>
        )}

        {/* ── Owner: common questions ── */}
        {step === 'owner-questions' && (
          <>
            <p style={styles.subtitle}>{t.selectQuestionSubtitle}</p>
            <div style={styles.questionsGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <button key={i} style={{ ...styles.questionCard, ...(i === 0 ? styles.questionCardSelected : {}) }}>
                  <div style={styles.questionFace}>😞</div>
                  <span style={styles.questionText}>{t.ownerQuestion}</span>
                </button>
              ))}
            </div>
            <button style={styles.otherBtn} onClick={() => setStep('other-questions')}>
              <span style={styles.micCircle}>🎤</span>
              <span>{t.otherQuestions}</span>
            </button>
          </>
        )}

        {/* ── Guest: input (type or speak) ── */}
        {step === 'guest-input' && (
          <>
            <p style={styles.subtitle}>{t.translateWillHelp}</p>

            <div style={styles.inputWrap}>
              <textarea
                style={styles.textarea}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.typeHerePlaceholder}
                rows={4}
              />
              {error && <p style={styles.errorText}>{error}</p>}
            </div>

            <div style={styles.inputActions}>
              <button
                style={{ ...styles.micBtn, ...(isListening ? styles.micBtnActive : {}) }}
                onClick={isListening ? stopListening : startListening}
              >
                <span style={styles.micIcon}>🎤</span>
                <span style={styles.micLabel}>{isListening ? t.listeningText : t.tapMic}</span>
              </button>

              <button
                style={{
                  ...styles.translateBtn,
                  ...((!inputText.trim() || isTranslating) ? styles.translateBtnDisabled : {}),
                }}
                onClick={handleTranslate}
                disabled={!inputText.trim() || isTranslating}
              >
                {isTranslating ? t.translatingText : t.translateBtn}
              </button>
            </div>
          </>
        )}

        {/* ── Guest: translation result ── */}
        {step === 'guest-result' && (
          <>
            <div style={styles.showOwnerBanner}>
              <span style={styles.showOwnerIcon}>👇</span>
              <span style={styles.showOwnerText}>{t.showToOwner}</span>
            </div>

            <div style={styles.resultCard}>
              <p style={styles.resultText}>{translatedText}</p>
            </div>

            <p style={styles.originalText}>
              <span style={styles.originalLabel}>{t.yourMessage}:</span> {inputText}
            </p>

            <div style={styles.resultBtns}>
              <button style={styles.btnNo} onClick={resetGuest}>{t.tryAgain}</button>
              <button style={styles.btnYes} onClick={onClose}>{t.done}</button>
            </div>
          </>
        )}

        {/* ── Other questions (owner-facing voice) ── */}
        {step === 'other-questions' && (
          <>
            <p style={styles.subtitle}>{t.speakClearly}</p>
            <div style={styles.translationCard}>
              <p style={{ ...styles.translationText, color: '#7A7570' }}>
                {isListening ? t.listeningText : t.tapMic}
              </p>
            </div>
            <button
              style={{ ...styles.micBtnLarge, ...(isListening ? styles.micBtnActive : {}) }}
              onClick={() => setIsListening(v => !v)}
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
    background: 'url(/Contact_popup.png) center/cover no-repeat',
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
  micCircle: { fontSize: 20 },
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

  // Guest input
  inputWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  textarea: {
    width: '100%',
    minHeight: 120,
    borderRadius: 16,
    border: '1.5px solid rgba(255,255,255,0.7)',
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(8px)',
    padding: '16px 20px',
    fontSize: 18,
    fontFamily: 'var(--font)',
    color: '#2A2720',
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    lineHeight: 1.6,
  },
  errorText: {
    fontSize: 13,
    color: '#C0392B',
    textAlign: 'center',
  },
  inputActions: {
    display: 'flex',
    gap: 16,
    width: '100%',
    alignItems: 'stretch',
  },
  micBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '14px 16px',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.5)',
    border: '1.5px solid rgba(255,255,255,0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  micBtnActive: {
    background: 'linear-gradient(135deg, #F8CB7F, #E8924E)',
    boxShadow: '0 4px 20px rgba(232,146,78,0.5)',
    border: '1.5px solid transparent',
  },
  micIcon: { fontSize: 26 },
  micLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#2A2720',
    fontFamily: 'var(--font)',
  },
  translateBtn: {
    flex: 1,
    padding: '14px 24px',
    borderRadius: 16,
    background: '#2A2720',
    border: 'none',
    fontSize: 17,
    fontWeight: 700,
    color: '#FAF8F2',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    transition: 'opacity 0.2s',
  },
  translateBtnDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },

  // Guest result
  showOwnerBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(42,39,32,0.08)',
    borderRadius: 30,
    padding: '8px 20px',
  },
  showOwnerIcon: { fontSize: 18 },
  showOwnerText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
  },
  resultCard: {
    width: '100%',
    minHeight: 140,
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(12px)',
    border: '1.5px solid rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: '28px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2A2720',
    lineHeight: 1.5,
    textAlign: 'center',
    fontFamily: 'var(--font)',
  },
  originalText: {
    fontSize: 13,
    color: '#7A7570',
    textAlign: 'center',
    maxWidth: '100%',
  },
  originalLabel: {
    fontWeight: 700,
    color: '#5A5550',
  },
  resultBtns: {
    display: 'flex',
    gap: 16,
    width: '100%',
  },
  btnNo: {
    flex: 1,
    padding: '16px',
    borderRadius: 30,
    background: 'rgba(255,255,255,0.5)',
    border: '1px solid rgba(255,255,255,0.7)',
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
    background: '#2A2720',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    color: '#FAF8F2',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
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
  micBtnLarge: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(210,205,200,0.5)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
}
