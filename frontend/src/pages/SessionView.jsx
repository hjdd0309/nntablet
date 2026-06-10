import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/로고.png'

export default function SessionView() {
  const { token } = useParams()
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
          <p style={v.subtitle}>
            {session.mode === 'photos' ? '📷 체험 사진' : '🎬 타임랩스 영상'}
          </p>
          <p style={v.date}>{new Date(session.created_at).toLocaleDateString('ko-KR')}</p>
        </div>
      </div>

      {session.mode === 'photos' ? (
        <div style={v.grid}>
          {urls.map((url, i) => (
            <div key={i} style={v.imgWrap} onClick={() => setSelected(url)}>
              <img src={url} alt={`photo ${i + 1}`} style={v.img} />
            </div>
          ))}
        </div>
      ) : (
        <div style={v.videoWrap}>
          <video
          src={urls[0]}
          controls
          style={v.video}
          onCanPlay={(e) => { e.target.playbackRate = 2 }}
        />
        </div>
      )}

      {selected && (
        <div style={v.overlay} onClick={() => setSelected(null)}>
          <img src={selected} alt="" style={v.fullImg} onClick={e => e.stopPropagation()} />
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
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.2s ease',
  },
  videoWrap: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    maxWidth: 700,
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    background: '#000',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: 20,
  },
  fullImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 12,
    objectFit: 'contain',
  },
}
