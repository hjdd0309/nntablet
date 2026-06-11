import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { supabase } from '../lib/supabase'
import logo from '../assets/로고.png'

export default function SessionView() {
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const frameId = searchParams.get('frame')
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const captureRef = useRef(null)

  useEffect(() => {
    async function fetchSession() {
      const { data, error } = await supabase
        .from('craft_sessions')
        .select('*')
        .eq('session_token', token)
        .single()
      if (error || !data) setError('기록을 찾을 수 없습니다.')
      else setSession(data)
      setLoading(false)
    }
    fetchSession()
  }, [token])

  async function handleSaveAll() {
    if (!captureRef.current) return
    setSaving(true)
    try {
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#FAF8F2',
        scale: 2,
      })
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95))
      const file = new File([blob], 'nanyeong-record.jpg', { type: 'image/jpeg' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: '나녕 체험 기록' })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'nanyeong-record.jpg'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  if (loading) return (
    <div style={v.page}>
      <div style={v.center}>
        <div className="spinner" />
      </div>
    </div>
  )

  if (error) return (
    <div style={v.page}>
      <div style={v.center}>
        <p style={v.errorText}>{error}</p>
      </div>
    </div>
  )

  const urls = session.media_urls || []

  return (
    <div style={v.page}>
      <div ref={captureRef} style={v.captureWrapper}>
        <div style={v.header}>
          <button style={v.backBtn} onClick={() => navigate(-1)}>‹ 뒤로</button>
          <div style={v.headerCenter}>
            <img src={logo} alt="나녕" style={v.logo} />
          </div>
          <div style={v.headerRight}>
            <p style={v.subtitle}>체험 사진</p>
            <p style={v.date}>{new Date(session.created_at).toLocaleDateString('ko-KR')}</p>
          </div>
        </div>

        <div style={v.captureArea}>
          <div style={v.grid}>
            {urls.map((url, i) => (
              <div key={i} style={v.imgWrap} onClick={() => setSelected(url)}>
                <img src={url} alt={`photo ${i + 1}`} style={v.img} crossOrigin="anonymous" />
                {frameId && <img src={`/프레임${frameId}.png`} alt="" style={v.frameOverlay} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button style={v.saveAllBtn} onClick={handleSaveAll} disabled={saving}>
        {saving ? '저장 중...' : '↓ 전체 저장'}
      </button>

      {selected && (
        <div style={v.overlay} onClick={() => setSelected(null)}>
          <div style={v.fullImgWrap} onClick={e => e.stopPropagation()}>
            <img src={selected} alt="" style={v.fullImg} />
            {frameId && <img src={`/프레임${frameId}.png`} alt="" style={v.frameOverlayFull} />}
          </div>
        </div>
      )}
    </div>
  )
}

const v = {
  page: {
    minHeight: '100vh',
    background: '#FAF8F2',
    fontFamily: "'Nunito', 'Apple SD Gothic Neo', sans-serif",
    padding: '0 0 40px',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '20px 28px',
    borderBottom: '1px solid rgba(0,0,0,0.07)',
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(8px)',
    position: 'relative',
    zIndex: 10,
  },
  headerCenter: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  },
  headerRight: {
    marginLeft: 'auto',
    textAlign: 'right',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 700,
    color: '#2A2720',
    background: 'rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 14,
    padding: '6px 12px',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    flexShrink: 0,
  },
  logo: {
    height: 40,
    objectFit: 'contain',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#2A2720',
    margin: 0,
  },
  date: {
    fontSize: 13,
    color: '#ADA9A4',
    margin: '2px 0 0',
  },
  saveAllBtn: {
    position: 'fixed',
    bottom: 28,
    right: 28,
    padding: '14px 28px',
    borderRadius: 30,
    background: 'linear-gradient(135deg, #F8CB7F 0%, #E8924E 100%)',
    border: 'none',
    fontSize: 15,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    zIndex: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#7A7570',
    textAlign: 'center',
  },
  captureWrapper: {
    background: '#FAF8F2',
  },
  captureArea: {
    background: '#FAF8F2',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '24px 24px 100px',
  },
  imgWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    aspectRatio: '4 / 3',
    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
    position: 'relative',
    cursor: 'pointer',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  frameOverlay: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    pointerEvents: 'none',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: 20,
    gap: 16,
  },
  fullImgWrap: {
    position: 'relative',
    maxWidth: '100%',
    maxHeight: '85vh',
    borderRadius: 12,
    overflow: 'hidden',
    flexShrink: 0,
  },
  fullImg: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '85vh',
    borderRadius: 12,
    objectFit: 'contain',
  },
  frameOverlayFull: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    pointerEvents: 'none',
  },
}
