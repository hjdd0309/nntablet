import { useState, useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useT } from '../../i18n'

const LANG_CONFIG = {
  'English':  { api: 'en', speech: 'en-US' },
  '한국어':   { api: 'ko', speech: 'ko-KR' },
  'Español':  { api: 'es', speech: 'es-ES' },
  'にほんご': { api: 'ja', speech: 'ja-JP' },
  '汉语':     { api: 'zh', speech: 'zh-CN' },
}

async function fetchTranslation(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Translation failed')
  const data = await res.json()
  const translated = data?.[0]?.map(chunk => chunk?.[0]).filter(Boolean).join('')
  if (!translated) throw new Error('Translation failed')
  return translated
}

export default function AskForHelpModal({ onClose }) {
  const t = useT()
  const { language } = useApp()
  const [step, setStep] = useState('role')
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState('')
  const [bars, setBars] = useState(Array(24).fill(0))
  const [ownerMicText, setOwnerMicText] = useState('')
  const [ownerMicResult, setOwnerMicResult] = useState('')
  const [ownerMicLoading, setOwnerMicLoading] = useState(false)
  const recRef = useRef(null)
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const streamRef = useRef(null)
  const animFrameRef = useRef(null)

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
      audioCtxRef.current?.close()
    }
  }, [])

  const startVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      analyserRef.current = analyser
      ctx.createMediaStreamSource(stream).connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteFrequencyData(data)
        setBars(Array.from(data).slice(0, 24).map(v => v / 255))
        animFrameRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {}
  }

  const stopVisualization = () => {
    cancelAnimationFrame(animFrameRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    setBars(Array(24).fill(0))
  }

  const cfg = LANG_CONFIG[language] || LANG_CONFIG['English']
  const srcCode = cfg.api
  const tgtCode = 'ko'
  const isKorean = srcCode === 'ko'

  const startListening = (onResult) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setError(t.speechNotSupported); return }
    const rec = new SR()
    rec.lang = cfg.speech
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      if (onResult) onResult(transcript)
      else setInputText(prev => prev + transcript)
      setIsListening(false)
      stopVisualization()
    }
    rec.onerror = (e) => {
      setIsListening(false)
      stopVisualization()
      if (e.error === 'not-allowed') setError('마이크 권한이 필요해요. 브라우저 설정에서 허용해주세요.')
      else if (e.error === 'no-speech') setError('음성이 감지되지 않았어요. 다시 시도해주세요.')
      else if (e.error === 'network') setError('네트워크 오류가 발생했어요.')
      else if (e.error === 'service-not-allowed') setError('음성 인식을 사용하려면 HTTPS가 필요해요.')
      else setError('음성 인식 오류: ' + e.error)
    }
    rec.onend = () => { setIsListening(false); stopVisualization() }
    recRef.current = rec
    rec.start()
    setIsListening(true)
    startVisualization()
  }

  const handleOwnerMic = () => {
    if (isListening) { stopListening(); return }
    setOwnerMicResult('')
    setOwnerMicText('')
    setError('')
    startListening(async (text) => {
      setOwnerMicText(text)
      setOwnerMicLoading(true)
      try {
        const result = await fetchTranslation(text)
        setOwnerMicResult(result)
      } catch {
        setError(t.translationError)
      }
      setOwnerMicLoading(false)
    })
  }

  const handleQuestionSelect = async (questionText) => {
    setOwnerMicText(questionText)
    setOwnerMicResult('')
    setError('')
    setOwnerMicLoading(true)
    try {
      const result = await fetchTranslation(questionText)
      setOwnerMicResult(result)
    } catch {
      setError(t.translationError)
    }
    setOwnerMicLoading(false)
  }

  const handleOwnerTextTranslate = async () => {
    if (!ownerMicText.trim()) return
    setOwnerMicLoading(true)
    setOwnerMicResult('')
    setError('')
    try {
      const result = await fetchTranslation(ownerMicText.trim())
      setOwnerMicResult(result)
    } catch {
      setError(t.translationError)
    }
    setOwnerMicLoading(false)
  }

  const stopListening = () => {
    recRef.current?.stop()
    setIsListening(false)
    stopVisualization()
  }

  const startGuestListening = () => {
    startListening(async (text) => {
      setInputText(text)
      if (!text.trim()) return
      setIsTranslating(true)
      setError('')
      try {
        const result = await fetchTranslation(text.trim())
        setTranslatedText(result)
        setStep('guest-result')
      } catch {
        setError(t.translationError)
      } finally {
        setIsTranslating(false)
      }
    })
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return
    setIsTranslating(true)
    setError('')
    try {
      const result = await fetchTranslation(inputText.trim())
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
    if (isListening) stopListening()
    if (step === 'guest-result') { resetGuest(); return }
    setStep('role')
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
              <button style={styles.roleCard} onClick={() => setStep('guest-input')}>
                <span style={styles.cardArrow}>→</span>
                <span style={styles.cardLabel}>
                  {t.imOwner.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
                </span>
              </button>
              <button style={{ ...styles.roleCard, ...styles.roleCardActive }} onClick={() => setStep('owner-questions')}>
                <span style={styles.cardArrow}>→</span>
                <span style={styles.cardLabel}>
                  {t.imGuest.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
                </span>
              </button>
            </div>
          </>
        )}

        {/* ── 손님: question cards + mic ── */}
        {step === 'owner-questions' && (
          <>
            <p style={styles.subtitle}>{t.selectQuestionSubtitle}</p>
            <div style={styles.questionsGrid}>
              {t.guestQuestions.map((q, i) => (
                <button key={i} style={styles.questionCard} onClick={() => handleQuestionSelect(q.text)}>
                  <div style={styles.questionFace}>{q.emoji}</div>
                  <span style={styles.questionText}>{q.text}</span>
                </button>
              ))}
            </div>

            <div style={styles.ownerMicSection}>
              <p style={styles.ownerMicLabel}>{t.moreQuestions}</p>

              <div style={styles.inputWrap}>
                <textarea
                  style={styles.textarea}
                  value={ownerMicText}
                  onChange={(e) => { setOwnerMicText(e.target.value); setOwnerMicResult('') }}
                  placeholder={t.typeHerePlaceholder}
                  rows={3}
                />
              </div>

              <div style={styles.inputActions}>
                <button
                  style={{ ...styles.micBtn, ...(isListening ? styles.micBtnActive : {}) }}
                  onClick={handleOwnerMic}
                >
                  {isListening ? (
                    <div style={styles.waveWrap}>
                      {bars.map((v, i) => (
                        <div key={i} style={{ ...styles.waveBar, height: `${Math.max(4, v * 44)}px`, opacity: 0.5 + v * 0.5 }} />
                      ))}
                    </div>
                  ) : (
                    <span style={styles.micIcon}>🎤</span>
                  )}
                  <span style={styles.micLabel}>{isListening ? t.listeningText : t.tapMic}</span>
                </button>

                {isListening ? (
                  <button style={styles.stopBtn} onClick={stopListening}>{t.stopListening}</button>
                ) : (
                  <button
                    style={{ ...styles.translateBtn, ...(!ownerMicText.trim() || ownerMicLoading ? styles.translateBtnDisabled : {}) }}
                    onClick={handleOwnerTextTranslate}
                    disabled={!ownerMicText.trim() || ownerMicLoading}
                  >
                    {ownerMicLoading ? t.translatingText : t.translateBtn}
                  </button>
                )}
              </div>

              {error && !isListening && <p style={{ ...styles.ownerMicHint, color: '#C0392B' }}>{error}</p>}
              {ownerMicLoading && <p style={styles.ownerMicHint}>{t.translatingText}</p>}
              {ownerMicResult && (
                <div style={styles.ownerMicResult}>
                  <p style={styles.resultText}>{ownerMicResult}</p>
                  <p style={styles.originalText}><span style={styles.originalLabel}>{t.yourMessage}:</span> {ownerMicText}</p>
                </div>
              )}
            </div>
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
                onClick={isListening ? stopListening : startGuestListening}
              >
                {isListening ? (
                  <div style={styles.waveWrap}>
                    {bars.map((v, i) => (
                      <div key={i} style={{
                        ...styles.waveBar,
                        height: `${Math.max(4, v * 44)}px`,
                        opacity: 0.5 + v * 0.5,
                      }} />
                    ))}
                  </div>
                ) : (
                  <span style={styles.micIcon}>🎤</span>
                )}
                <span style={styles.micLabel}>{isListening ? t.listeningText : t.tapMic}</span>
              </button>

              {isListening ? (
                <button style={styles.stopBtn} onClick={stopListening}>
                  {t.stopListening}
                </button>
              ) : (
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
              )}
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

            {inputText && (
              <div style={styles.detectedCard}>
                <p style={styles.detectedLabel}>{t.yourMessage}</p>
                <p style={styles.detectedText}>{inputText}</p>
              </div>
            )}

            <div style={styles.resultCard}>
              <p style={styles.resultText}>{translatedText}</p>
            </div>

            <div style={styles.resultBtns}>
              <button style={styles.btnNo} onClick={resetGuest}>{t.tryAgain}</button>
              <button style={styles.btnYes} onClick={onClose}>{t.done}</button>
            </div>
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

  ownerMicDetected: {
    fontSize: 16,
    fontWeight: 600,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    padding: '10px 16px',
    width: '100%',
    margin: 0,
  },
  detectedCard: {
    width: '100%',
    background: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: '14px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  detectedLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#ADA9A4',
    fontFamily: 'var(--font)',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  detectedText: {
    fontSize: 18,
    fontWeight: 600,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    margin: 0,
    lineHeight: 1.4,
  },
  ownerMicSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  ownerMicLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: '#7A7570',
    fontFamily: 'var(--font)',
    margin: 0,
    textAlign: 'center',
  },
  ownerMicHint: {
    fontSize: 13,
    color: '#ADA9A4',
    textAlign: 'center',
    margin: 0,
    fontFamily: 'var(--font)',
  },
  ownerMicResult: {
    width: '100%',
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(12px)',
    border: '1.5px solid rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
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
  waveWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    height: 48,
  },
  waveBar: {
    width: 4,
    borderRadius: 3,
    background: '#2A2720',
    transition: 'height 0.08s ease',
    minHeight: 4,
    flexShrink: 0,
  },
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
  stopBtn: {
    flex: 1,
    padding: '14px 24px',
    borderRadius: 16,
    background: 'rgba(0,0,0,0.06)',
    border: '1.5px solid rgba(0,0,0,0.12)',
    fontSize: 16,
    fontWeight: 700,
    color: '#7A7570',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
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
