import { useRef } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'

export default function PhotoPromptOverlay() {
  const { recordMode, showPhotoPrompt, sessionToken, addSessionPhoto, dismissPhotoPrompt } = useApp()
  const fileInputRef = useRef(null)

  if (!showPhotoPrompt) return null

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !sessionToken) { dismissPhotoPrompt(); return }
    try {
      const id = Math.random().toString(36).substring(2, 10)
      const path = `${sessionToken}/shot_${Date.now()}_${id}.jpg`
      const { error } = await supabase.storage
        .from('nntablet')
        .upload(path, file, { contentType: file.type || 'image/jpeg', upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('nntablet').getPublicUrl(path)
      const { data: session } = await supabase
        .from('craft_sessions').select('media_urls').eq('session_token', sessionToken).single()
      await supabase.from('craft_sessions')
        .update({ media_urls: [...(session?.media_urls || []), publicUrl] })
        .eq('session_token', sessionToken)
      addSessionPhoto(publicUrl)
    } catch {
      dismissPhotoPrompt()
    }
  }

  return (
    <div style={s.overlay}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFile}
        // reset value so the same file can trigger onChange again
        onClick={e => { e.target.value = '' }}
      />

      <div style={s.card}>
        <span style={s.icon}>{recordMode === 'auto' ? '📷' : '🔔'}</span>

        {recordMode === 'auto' ? (
          <>
            <p style={s.title}>촬영 시간이에요!</p>
            <p style={s.sub}>카메라가 열립니다</p>
            <button style={s.btnPrimary} onClick={() => fileInputRef.current?.click()}>
              지금 찍기
            </button>
          </>
        ) : (
          <>
            <p style={s.title}>사진을 찍을까요?</p>
            <p style={s.sub}>15분이 지났어요</p>
            <div style={s.btnRow}>
              <button style={s.btnSecondary} onClick={dismissPhotoPrompt}>건너뛰기</button>
              <button style={s.btnPrimary} onClick={() => fileInputRef.current?.click()}>찍기</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    backdropFilter: 'blur(6px)',
  },
  card: {
    background: 'rgba(250,248,242,0.97)',
    borderRadius: 28,
    padding: '36px 48px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 16px 56px rgba(0,0,0,0.22)',
    minWidth: 300,
  },
  icon: {
    fontSize: 52,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    margin: 0,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: '#ADA9A4',
    fontFamily: 'var(--font)',
    margin: 0,
    textAlign: 'center',
  },
  btnRow: {
    display: 'flex',
    gap: 10,
    marginTop: 8,
    width: '100%',
  },
  btnSecondary: {
    flex: 1,
    padding: '13px',
    borderRadius: 30,
    background: 'rgba(0,0,0,0.06)',
    border: 'none',
    fontSize: 15,
    fontWeight: 600,
    color: '#7A7570',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  btnPrimary: {
    flex: 1,
    padding: '13px 24px',
    borderRadius: 30,
    background: 'linear-gradient(135deg, #F8CB7F 0%, #E8924E 100%)',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    marginTop: 8,
    width: '100%',
  },
}
