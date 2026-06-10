import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'
import { supabase } from '../lib/supabase'

const generateToken = () => Math.random().toString(36).substring(2, 10)

export default function ProcessLog() {
  const navigate = useNavigate()
  const { setSessionToken, startRecording, stopRecording, recordMode, nextShotCountdown } = useApp()

  const fmtCountdown = (s) => {
    if (s === null) return ''
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }
  const t = useT()
  const [mode, setMode] = useState(null) // null | 'timelapse' | 'photos'

  const handleRecord = async (recMode) => {
    // 타이머·토큰은 DB와 무관하게 즉시 시작
    const token = generateToken()
    setSessionToken(token)
    startRecording(recMode, mode)
    navigate('/choose-design')

    // DB 저장은 백그라운드에서 시도
    supabase.from('craft_sessions').insert({
      session_token: token,
      mode: mode,
      media_urls: [],
    }).then(({ error }) => {
      if (error) console.error('세션 생성 실패:', error.message)
    })
  }

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/2_배경.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header
        showBack
        onBack={mode !== null ? () => setMode(null) : undefined}
        backTo={mode === null ? '/overview' : undefined}
        showCall
        showHome
      />
      <h1 style={styles.title}>{t.logYourCraft}</h1>
      <StepProgress currentStep={1} />

      {/* 모드 선택 */}
      {mode === null && (
        <div style={styles.content}>
          <div style={styles.cardRow}>
            <button style={styles.card} onClick={() => setMode('timelapse')}>
              <span style={styles.arrow}>→</span>
              <div style={styles.cardBottom}>
                <span style={styles.cardDesc}>{t.timelapseDesc}</span>
                <span style={styles.cardLabel}>{t.timelapse}</span>
              </div>
            </button>
            <button style={styles.card} onClick={() => setMode('photos')}>
              <span style={styles.arrow}>→</span>
              <div style={styles.cardBottom}>
                <span style={styles.cardDesc}>{t.photoAlertsDesc}</span>
                <span style={styles.cardLabel}>{t.photoAlerts}</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 촬영 방식 선택 */}
      {mode !== null && (
        <div style={styles.content}>
          <div style={styles.splitLayout}>
            {/* 왼쪽: 빈 공간 (촬영 중이면 타이머 표시) */}
            <div style={styles.placeholder}>
              {recordMode && nextShotCountdown !== null ? (
                <div style={styles.timerInner}>
                  <span style={styles.timerCamIcon}>📷</span>
                  <span style={styles.timerLabel}>{t.nextShotLabel}</span>
                  <span style={styles.timerCountdown}>{fmtCountdown(nextShotCountdown)}</span>
                </div>
              ) : null}
            </div>

            {/* 오른쪽: 3버튼 */}
            <div style={styles.promptCard}>
              <h2 style={styles.promptTitle}>
                {mode === 'timelapse' ? t.saveYourProcess : t.takeProgressPhotos}
              </h2>
              <p style={styles.promptSub}>
                {mode === 'timelapse' ? t.createTimelapse : t.photoReminderSub}
              </p>
              <div style={styles.btnGroup}>
                <button
                  style={styles.btnNo}
                  onClick={() => { stopRecording(); navigate('/choose-design') }}
                >
                  {t.noThanks}
                </button>
                <button
                  style={styles.btnNo}
                  onClick={() => handleRecord('auto')}
                >
                  {t.recordAutomatic}
                </button>
                <button
                  style={styles.btnNo}
                  onClick={() => handleRecord('alert')}
                >
                  {t.recordWithAlert}
                </button>
              </div>
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
    background: '#F5F2EA',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 8,
    zIndex: 2,
    position: 'relative',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 60px 24px',
    zIndex: 2,
    overflow: 'hidden',
  },
  cardRow: {
    display: 'flex',
    gap: 24,
    width: '100%',
    maxWidth: 800,
  },
  card: {
    flex: 1,
    height: 260,
    background: 'rgba(255,255,255,0.35)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '24px 28px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(248,203,127,0.15) 100%)',
  },
  arrow: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1.5px solid #2A2720',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  cardBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 'auto',
  },
  cardDesc: {
    fontSize: 13,
    color: '#7A7570',
    textAlign: 'left',
    lineHeight: 1.5,
  },
  cardLabel: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2A2720',
    textAlign: 'left',
    lineHeight: 1.3,
    paddingBottom: 8,
  },
  splitLayout: {
    display: 'flex',
    gap: 20,
    width: '100%',
    maxWidth: 1000,
    height: 380,
  },
  placeholder: {
    flex: 1.5,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.25)',
    border: '1.5px dashed rgba(42,39,32,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timerCamIcon: {
    fontSize: 28,
  },
  timerCountdown: {
    fontSize: 20,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
  },
  timerLabel: {
    fontSize: 14,
    color: '#7A7570',
    fontFamily: 'var(--font)',
  },
  promptCard: {
    flex: 1,
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(8px)',
    borderRadius: 20,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    border: '1px solid rgba(255,255,255,0.8)',
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
  },
  promptSub: {
    fontSize: 13,
    color: '#7A7570',
    fontFamily: 'var(--font)',
    lineHeight: 1.5,
  },
  btnGroup: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  btnNo: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 30,
    background: 'rgba(250,248,242,0.8)',
    border: '1px solid rgba(0,0,0,0.06)',
    fontSize: 13,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    textAlign: 'center',
    lineHeight: 1.4,
  },
}
