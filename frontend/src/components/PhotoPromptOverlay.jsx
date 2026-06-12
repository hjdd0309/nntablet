import { useRef, useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'
import { supabase } from '../lib/supabase'

export default function PhotoPromptOverlay() {
  const { recordMode, showPhotoPrompt, sessionToken, addSessionPhoto, dismissPhotoPrompt } = useApp()
  const t = useT()

  const [cameraOpen, setCameraOpen] = useState(false)
  const [captured, setCaptured] = useState(null) // { url, blob } after snapshot
  const [uploading, setUploading] = useState(false)
  const [camError, setCamError] = useState(false)
  const [facingMode, setFacingMode] = useState('environment')

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  const openCamera = async (mode) => {
    const fm = mode ?? facingMode
    setCamError(false)
    setCaptured(null)
    setCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: fm, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      setCamError(true)
    }
  }

  const flipCamera = async () => {
    const next = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    stopStream()
    await openCamera(next)
  }

  const takeSnapshot = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      if (!blob) return
      stopStream()
      setCaptured({ url: URL.createObjectURL(blob), blob })
    }, 'image/jpeg', 0.92)
  }

  const retake = async () => {
    if (captured) { URL.revokeObjectURL(captured.url); setCaptured(null) }
    await openCamera()
  }

  const closeCamera = () => {
    stopStream()
    if (captured) { URL.revokeObjectURL(captured.url) }
    setCaptured(null)
    setCameraOpen(false)
  }

  const confirmPhoto = async () => {
    if (!captured) return
    setUploading(true)
    try {
      const id = Math.random().toString(36).substring(2, 10)
      const path = sessionToken
        ? `${sessionToken}/shot_${Date.now()}_${id}.jpg`
        : `anon/shot_${Date.now()}_${id}.jpg`
      const { error } = await supabase.storage
        .from('nntablet')
        .upload(path, captured.blob, { contentType: 'image/jpeg', upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('nntablet').getPublicUrl(path)
      if (sessionToken) {
        const { data: session } = await supabase
          .from('craft_sessions').select('media_urls').eq('session_token', sessionToken).single()
        await supabase.from('craft_sessions')
          .update({ media_urls: [...(session?.media_urls || []), publicUrl] })
          .eq('session_token', sessionToken)
      }
      URL.revokeObjectURL(captured.url)
      addSessionPhoto(publicUrl)
    } catch (err) {
      console.error('사진 저장 실패:', err)
      dismissPhotoPrompt()
    } finally {
      setUploading(false)
      setCameraOpen(false)
      setCaptured(null)
    }
  }

  const cancel = () => {
    closeCamera()
    dismissPhotoPrompt()
  }

  // clean up stream when overlay unmounts or hides
  useEffect(() => {
    if (!showPhotoPrompt) {
      stopStream()
      setCameraOpen(false)
      if (captured) { URL.revokeObjectURL(captured.url); setCaptured(null) }
    }
  }, [showPhotoPrompt, stopStream]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!showPhotoPrompt) return null

  return (
    <div style={s.overlay}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {cameraOpen ? (
        <div style={s.cameraModal}>
          {camError ? (
            <div style={s.camError}>
              <p style={s.camErrorText}>{t.camError}</p>
              <button style={s.btnSecondary} onClick={cancel}>{t.close}</button>
            </div>
          ) : captured ? (
            <>
              <img src={captured.url} alt="preview" style={s.preview} />
              <div style={s.camActions}>
                <button style={s.btnSecondary} onClick={retake}>{t.retake}</button>
                <button style={s.btnPrimary} onClick={confirmPhoto} disabled={uploading}>
                  {uploading ? t.saving : t.usePhoto}
                </button>
              </div>
            </>
          ) : (
            <>
              <video ref={videoRef} style={s.videoFeed} playsInline muted autoPlay />
              <div style={s.camActions}>
                <button style={s.cancelBtn} onClick={cancel}>{t.cancel}</button>
                <button style={s.shutterBtn} onClick={takeSnapshot}>
                  <div style={s.shutterInner} />
                </button>
                <button style={s.flipBtn} onClick={flipCamera}>🔄</button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={s.card}>
          <span style={s.icon}>{recordMode === 'auto' ? '📷' : '🔔'}</span>

          {recordMode === 'auto' ? (
            <>
              <p style={s.title}>{t.photoTimeTitle}</p>
              <p style={s.sub}>{t.photoTimeSub}</p>
              <button style={s.btnPrimary} onClick={openCamera}>{t.photoTakeNow}</button>
            </>
          ) : (
            <>
              <p style={s.title}>{t.photoPromptTitle}</p>
              <p style={s.sub}>{t.photoPromptSub}</p>
              <div style={s.btnRow}>
                <button style={s.btnSecondary} onClick={dismissPhotoPrompt}>{t.skip}</button>
                <button style={s.btnPrimary} onClick={openCamera}>{t.shoot}</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const s = {
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
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
  icon: { fontSize: 52, marginBottom: 4 },
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
  btnRow: { display: 'flex', gap: 10, marginTop: 8, width: '100%' },
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
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: 30,
    background: 'rgba(0,0,0,0.06)',
    border: 'none',
    fontSize: 15,
    fontWeight: 600,
    color: '#7A7570',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    whiteSpace: 'nowrap',
  },
  flipBtn: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: '1.5px solid rgba(42,39,32,0.2)',
    background: 'rgba(255,255,255,0.8)',
    fontSize: 22,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cameraModal: {
    width: '80vw',
    maxWidth: 900,
    background: '#1a1814',
    borderRadius: 24,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 16px 56px rgba(0,0,0,0.5)',
  },
  videoFeed: {
    width: '100%',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    display: 'block',
    background: '#000',
  },
  preview: {
    width: '100%',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    display: 'block',
  },
  camActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: '20px 32px',
    background: 'rgba(250,248,242,0.97)',
  },
  shutterBtn: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    border: '3px solid #2A2720',
    background: 'rgba(255,255,255,0.9)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  shutterInner: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: '#2A2720',
  },
  camError: {
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    background: 'rgba(250,248,242,0.97)',
  },
  camErrorText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    margin: 0,
  },
}
