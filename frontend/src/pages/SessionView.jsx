import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/로고.png'

async function saveImage(url, filename = 'nanyeong-photo.jpg') {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const file = new File([blob], filename, { type: blob.type || 'image/jpeg' })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: '나녕 체험 사진' })
    } else if (navigator.share) {
      await navigator.share({ url, title: '나녕 체험 사진' })
    } else {
      window.open(url, '_blank')
    }
  } catch {
    window.open(url, '_blank')
  }
}

export default function SessionView() {
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const frameId = searchParams.get('frame')
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('craft_sessions')
        .select('*')
        .eq('session_token', token)
        .single()
      if (error || !data) setError('기록을 찾을 수 없습니다.')
      else setSession(data)
      setLoading(false)
    }
    fetch()
  }, [token])

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
      <div style={v.header}>
        <img src={logo} alt="나녕" style={v.logo} />
        <div>
          <p style={v.subtitle}>📷 체험 사진</p>
          <p style={v.date}>{new Date(session.created_at).toLocaleDateString('ko-KR')}</p>
        </div>
      </div>

      <div style={v.grid}>
        {urls.map((url, i) => (
          <div key={i} style={v.imgWrap}>
            <img src={url} alt={`photo ${i + 1}`} style={v.img} onClick={() => setSelected(url)} />
            {frameId && <img src={`/프레임${frameId}.png`} alt="" style={v.frameOverlay} />}
            <button style={v.saveBtn} onClick={() => saveImage(url, `nanyeong-${i + 1}.jpg`)}>
              ↓ 저장
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div style={v.overlay} onClick={() => setSelected(null)}>
          <div style={v.fullImgWrap} onClick={e => e.stopPropagation()}>
            <img src={selected} alt="" style={v.fullImg} />
            {frameId && <img src={`/프레임${frameId}.png`} alt="" style={v.frameOverlayFull} />}
          </div>
          <button
            style={v.fullSaveBtn}
            onClick={e => { e.stopPropagation(); saveImage(selected) }}
          >
            ↓ 저장하기
          </button>
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
    gap: 16,
    padding: '24px 28px 20px',
    borderBottom: '1px solid rgba(0,0,0,0.07)',
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(8px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
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
  errorText: {
    fontSize: 16,
    color: '#7A7570',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12,
    padding: '24px 24px',
  },
  imgWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: '1',
    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    cursor: 'pointer',
  },
  saveBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    padding: '6px 14px',
    borderRadius: 20,
    background: 'rgba(255,255,255,0.92)',
    border: 'none',
    fontSize: 13,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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
  fullSaveBtn: {
    padding: '14px 48px',
    borderRadius: 30,
    background: 'linear-gradient(135deg, #F8CB7F 0%, #E8924E 100%)',
    border: 'none',
    fontSize: 17,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
}
