import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'

export default function ProcessResultPage() {
  const navigate = useNavigate()
  const { sessionToken, selectedFrame } = useApp()
  const t = useT()

  const qrUrl = sessionToken
    ? `${window.location.origin}/view/${sessionToken}${selectedFrame ? `?frame=${selectedFrame}` : ''}`
    : null

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/7_기록.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/frame-select" showCall showHome />

      <div style={styles.content}>
        {qrUrl ? (
          <>
            <h1 style={styles.title}>{t.processHistory}</h1>
            <p style={styles.sub}>{t.qrScanSub}</p>

            <div style={styles.qrCard}>
              <div style={styles.qrBox}>
                <QRCodeSVG value={qrUrl} size={200} bgColor="transparent" fgColor="#2A2720" />
              </div>
              <p style={styles.qrHint}>{t.qrScanHint}</p>
            </div>

            <button style={styles.viewBtn} onClick={() => navigate(`/view/${sessionToken}?from=app${selectedFrame ? `&frame=${selectedFrame}` : ''}`)}>
              {t.viewHere}
            </button>
          </>
        ) : (
          <>
            <span style={styles.emptyIcon}>📭</span>
            <h1 style={styles.title}>{t.noRecord}</h1>
            <p style={styles.sub}>{t.noRecordSub.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</p>
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
    padding: '16px 40px 32px',
    overflowY: 'auto',
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
