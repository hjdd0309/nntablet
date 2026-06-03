import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import emailjs from '@emailjs/browser'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function ProcessResultPage() {
  const navigate = useNavigate()
  const { sessionToken } = useApp()
  const t = useT()

  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  const qrUrl = sessionToken
    ? `${window.location.origin}/view/${sessionToken}`
    : null

  const handleSendEmail = async () => {
    if (!email.trim() || !qrUrl) return
    setEmailStatus('sending')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { to_email: email.trim(), session_url: qrUrl },
        EMAILJS_PUBLIC_KEY,
      )
      setEmailStatus('sent')
    } catch {
      setEmailStatus('error')
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bg-white.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/completion" showCall showHome />

      <div style={styles.content}>
        {qrUrl ? (
          <>
            <h1 style={styles.title}>{t.processHistory}</h1>
            <p style={styles.sub}>QR 코드를 스캔하거나 이메일로 받으세요</p>

            <div style={styles.qrCard}>
              <div style={styles.qrBox}>
                <QRCodeSVG value={qrUrl} size={180} bgColor="transparent" fgColor="#2A2720" />
              </div>
              <p style={styles.qrHint}>카메라로 QR을 스캔하세요</p>
            </div>

            {/* 구분선 */}
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>또는</span>
              <div style={styles.dividerLine} />
            </div>

            {/* 이메일 전송 */}
            <div style={styles.emailWrap}>
              <input
                style={styles.emailInput}
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailStatus(null) }}
              />
              <button
                style={{
                  ...styles.emailBtn,
                  ...(emailStatus === 'sent' ? styles.emailBtnSent : {}),
                  ...(!email.trim() || emailStatus === 'sending' ? styles.emailBtnDisabled : {}),
                }}
                onClick={handleSendEmail}
                disabled={!email.trim() || emailStatus === 'sending' || emailStatus === 'sent'}
              >
                {emailStatus === 'sending' ? t.emailSending
                  : emailStatus === 'sent' ? t.emailSent
                  : t.sendEmail}
              </button>
            </div>
            {emailStatus === 'error' && <p style={styles.errorText}>{t.emailError}</p>}

            <button style={styles.viewBtn} onClick={() => navigate(`/view/${sessionToken}`)}>
              여기서 바로 보기 →
            </button>
          </>
        ) : (
          <>
            <span style={styles.emptyIcon}>📭</span>
            <h1 style={styles.title}>기록이 없습니다</h1>
            <p style={styles.sub}>촬영 기록을 남기려면 체험 시작 시<br />타임랩스 또는 사진 알림을 선택해주세요</p>
          </>
        )}
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    zIndex: 2,
    padding: '0 40px 32px',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    textAlign: 'center',
    margin: 0,
  },
  sub: {
    fontSize: 14,
    color: '#7A7570',
    fontFamily: 'var(--font)',
    textAlign: 'center',
    lineHeight: 1.6,
    margin: 0,
  },
  qrCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.8)',
    borderRadius: 24,
    padding: '24px 36px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  },
  qrBox: {
    background: '#fff',
    borderRadius: 14,
    padding: 14,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  qrHint: {
    fontSize: 12,
    color: '#ADA9A4',
    fontFamily: 'var(--font)',
    margin: 0,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 400,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'rgba(42,39,32,0.12)',
  },
  dividerText: {
    fontSize: 13,
    color: '#ADA9A4',
    fontFamily: 'var(--font)',
    whiteSpace: 'nowrap',
  },
  emailWrap: {
    display: 'flex',
    gap: 10,
    width: '100%',
    maxWidth: 480,
  },
  emailInput: {
    flex: 1,
    padding: '12px 18px',
    borderRadius: 14,
    border: '1.5px solid rgba(42,39,32,0.15)',
    background: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontFamily: 'var(--font)',
    color: '#2A2720',
    outline: 'none',
  },
  emailBtn: {
    padding: '12px 22px',
    borderRadius: 14,
    background: '#2A2720',
    border: 'none',
    fontSize: 14,
    fontWeight: 700,
    color: '#FAF8F2',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.2s',
  },
  emailBtnSent: {
    background: 'linear-gradient(135deg, #F8CB7F 0%, #E8924E 100%)',
    color: '#2A2720',
  },
  emailBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  errorText: {
    fontSize: 13,
    color: '#C0392B',
    fontFamily: 'var(--font)',
    margin: 0,
  },
  viewBtn: {
    padding: '12px 30px',
    borderRadius: 30,
    background: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(42,39,32,0.12)',
    fontSize: 14,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  emptyIcon: {
    fontSize: 52,
  },
}
