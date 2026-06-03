import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StepProgress from '../components/StepProgress'
import ShareArtworkModal from '../components/modals/ShareArtworkModal'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'
import { supabase } from '../lib/supabase'

export default function CompletionPage() {
  const navigate = useNavigate()
  const { sessionToken, resetSession } = useApp()
  const [showShare, setShowShare] = useState(false)
  const t = useT()

  const handleExit = async () => {
    if (sessionToken) {
      supabase.from('craft_sessions').delete().eq('session_token', sessionToken).then(() => {})
    }
    resetSession()
    navigate('/language')
  }

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bg-white.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/package" showCall showHome />
      <StepProgress currentStep={6} />

      <div style={styles.content}>
        <h1 style={styles.title}>{t.artworkComplete}</h1>

        <div style={styles.cardRow}>
          {/* 주변 탐색 */}
          <button style={styles.card} onClick={() => navigate('/workshops', { state: { explore: true } })}>
            <span style={styles.arrow}>→</span>
            <div style={styles.cardBottom}>
              <span style={styles.cardIcon}>📍</span>
              <span style={styles.cardLabel}>{t.exploreNearby}</span>
            </div>
          </button>

          {/* 작품 공유 */}
          <button style={styles.card} onClick={() => setShowShare(true)}>
            <span style={styles.arrow}>→</span>
            <div style={styles.cardBottom}>
              <span style={styles.cardIcon}>🎨</span>
              <span style={styles.cardLabel}>{t.shareMyArtwork}</span>
            </div>
          </button>

          {/* 제작 과정 보기 */}
          <button style={styles.card} onClick={() => navigate('/process-result')}>
            <span style={styles.arrow}>→</span>
            <div style={styles.cardBottom}>
              <span style={styles.cardIcon}>🎬</span>
              <span style={styles.cardLabel}>{t.processHistory}</span>
            </div>
          </button>
        </div>

        <button style={styles.exitBtn} onClick={handleExit}>
          {t.exitSession}
        </button>
      </div>

      {showShare && <ShareArtworkModal onClose={() => setShowShare(false)} />}
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
    padding: '0 40px 24px',
    gap: 28,
    zIndex: 2,
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    textAlign: 'center',
    flexShrink: 0,
  },
  cardRow: {
    display: 'flex',
    gap: 20,
    width: '100%',
    maxWidth: 900,
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
    padding: '20px 24px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(248,203,127,0.15) 100%)',
  },
  arrow: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '1.5px solid #2A2720',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  cardBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  cardIcon: {
    fontSize: 26,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 700,
    color: '#2A2720',
    textAlign: 'left',
    lineHeight: 1.3,
  },
  exitBtn: {
    padding: '26px 96px',
    borderRadius: 30,
    background: 'rgba(42,39,32,0.08)',
    border: '1px solid rgba(42,39,32,0.15)',
    fontSize: 20,
    fontWeight: 700,
    color: '#7A7570',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    flexShrink: 0,
    marginTop: 32,
  },
}
