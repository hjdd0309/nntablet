import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const generateId = () => Math.random().toString(36).substring(2, 10)

export default function ShareArtworkModal({ onClose }) {
  const navigate = useNavigate()
  const [step, setStep] = useState('capture') // 'capture' | 'preview' | 'uploading' | 'done'
  const [photoBlob, setPhotoBlob] = useState(null)
  const [photoUrl, setPhotoUrl] = useState(null)
  const [username, setUsername] = useState('')

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoBlob(file)
    setPhotoUrl(URL.createObjectURL(file))
    setStep('preview')
  }

  const pruneGallery = async () => {
    const MAX = 200
    const { data: rows, error } = await supabase
      .from('gallery')
      .select('id, image_url')
      .order('created_at', { ascending: true })
    if (error || !rows || rows.length <= MAX) return

    const toDelete = rows.slice(0, rows.length - MAX)

    // Storage 파일 삭제
    const storagePaths = toDelete
      .map(r => {
        try {
          const path = new URL(r.image_url).pathname.split('/object/public/nntablet/')[1]
          return path ? decodeURIComponent(path) : null
        } catch { return null }
      })
      .filter(Boolean)
    if (storagePaths.length > 0) {
      await supabase.storage.from('nntablet').remove(storagePaths)
    }

    // DB row 삭제
    const ids = toDelete.map(r => r.id)
    await supabase.from('gallery').delete().in('id', ids)
  }

  const handleUpload = async () => {
    if (!photoBlob) return
    setStep('uploading')
    try {
      const id = generateId()
      const mimeType = photoBlob.type || 'image/jpeg'
      const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
      const path = `artwork/${id}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('nntablet')
        .upload(path, photoBlob, { contentType: mimeType, upsert: true })
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('nntablet').getPublicUrl(path)
      const { error: dbErr } = await supabase.from('gallery').insert({
        image_url: publicUrl,
        username: username.trim() || '익명',
        likes: 0,
        saves: 0,
      })
      if (dbErr) throw dbErr

      // 200개 초과분 정리 (실패해도 업로드 성공으로 처리)
      pruneGallery().catch(console.error)

      setStep('done')
    } catch (e) {
      console.error('Upload error:', e)
      alert('업로드 실패: ' + e.message)
      setStep('preview')
    }
  }

  return (
    <div style={m.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={m.modal}>

        {/* Header */}
        <div style={m.header}>
          {step === 'preview' && (
            <button style={m.backBtn} onClick={() => { setStep('capture'); setPhotoUrl(null); setPhotoBlob(null) }}>‹</button>
          )}
          <span style={m.title}>내 작품 공유하기</span>
          <button style={m.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* ── Step: capture ── */}
        {step === 'capture' && (
          <>
            <p style={m.subtitle}>완성된 작품을 촬영해주세요</p>

            {/* Hidden native camera input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div style={m.captureCard}>
              <span style={m.cameraIcon}>📷</span>
              <p style={m.captureLabel}>카메라로 작품을 찍어주세요</p>
              <p style={m.captureSub}>버튼을 누르면 카메라가 열려요</p>
            </div>

            <div style={m.btnRow}>
              <button style={m.btnSecondary} onClick={onClose}>다음에 할게요</button>
              <button style={m.btnSnap} onClick={() => fileInputRef.current?.click()}>
                📷 촬영하기
              </button>
            </div>
          </>
        )}

        {/* ── Step: preview + username ── */}
        {step === 'preview' && (
          <div style={m.previewRow}>
            <div style={m.previewImgWrap}>
              <img src={photoUrl} alt="작품" style={m.previewImg} />
            </div>
            <div style={m.previewForm}>
              <p style={m.formLabel}>아이디를 입력해주세요</p>
              <p style={m.formSub}>익명으로 올려도 괜찮아요 :)</p>
              <input
                style={m.input}
                type="text"
                placeholder="닉네임 입력..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                maxLength={20}
              />
              <button style={m.anonBtn} onClick={() => setUsername('익명')}>
                익명으로 올리기
              </button>
              <button style={m.btnPrimary} onClick={handleUpload}>
                갤러리에 올리기 🎨
              </button>
            </div>
          </div>
        )}

        {/* ── Step: uploading ── */}
        {step === 'uploading' && (
          <div style={m.centerState}>
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 4 }} />
            <p style={m.stateText}>올리는 중...</p>
          </div>
        )}

        {/* ── Step: done ── */}
        {step === 'done' && (
          <div style={m.centerState}>
            <span style={m.doneIcon}>🎉</span>
            <p style={m.stateText}>갤러리에 올라갔어요!</p>
            <p style={m.stateSub}>갤러리에서 내 작품을 확인해보세요</p>
            <div style={m.btnRow}>
              <button style={m.btnSecondary} onClick={onClose}>닫기</button>
              <button style={m.btnPrimary} onClick={() => { onClose(); navigate('/gallery') }}>
                갤러리 보기 →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const m = {
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
    width: 760,
    background: 'url(/Contact_popup.png) center/cover no-repeat',
    borderRadius: 28,
    padding: '28px 36px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    boxShadow: '0 12px 48px rgba(0,0,0,0.22)',
    position: 'relative',
    alignItems: 'center',
  },
  header: {
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
    fontFamily: 'var(--font)',
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
    flexShrink: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A7570',
    textAlign: 'center',
    margin: '-8px 0 0',
    fontFamily: 'var(--font)',
  },
  captureCard: {
    width: '100%',
    height: 200,
    background: 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(8px)',
    border: '2px dashed rgba(42,39,32,0.2)',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  cameraIcon: {
    fontSize: 44,
  },
  captureLabel: {
    fontSize: 17,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    margin: 0,
  },
  captureSub: {
    fontSize: 13,
    color: '#ADA9A4',
    fontFamily: 'var(--font)',
    margin: 0,
  },
  btnRow: {
    display: 'flex',
    gap: 12,
    width: '100%',
  },
  btnSecondary: {
    flex: 1,
    padding: '14px',
    borderRadius: 30,
    background: 'rgba(255,255,255,0.5)',
    border: '1px solid rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: 600,
    color: '#7A7570',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  btnSnap: {
    flex: 2,
    padding: '14px',
    borderRadius: 30,
    background: '#2A2720',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    color: '#FAF8F2',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  previewRow: {
    display: 'flex',
    gap: 24,
    width: '100%',
    alignItems: 'stretch',
  },
  previewImgWrap: {
    flex: 1.2,
    borderRadius: 16,
    overflow: 'hidden',
    background: '#eee',
    minHeight: 260,
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  previewForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
  },
  formLabel: {
    fontSize: 18,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    margin: 0,
  },
  formSub: {
    fontSize: 13,
    color: '#ADA9A4',
    fontFamily: 'var(--font)',
    margin: 0,
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: 16,
    border: '1.5px solid rgba(255,255,255,0.7)',
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(8px)',
    fontSize: 16,
    fontFamily: 'var(--font)',
    color: '#2A2720',
    outline: 'none',
    boxSizing: 'border-box',
  },
  anonBtn: {
    width: '100%',
    padding: '11px 16px',
    borderRadius: 30,
    background: 'rgba(255,255,255,0.4)',
    border: '1px solid rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: 600,
    color: '#7A7570',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    borderRadius: 30,
    background: 'linear-gradient(135deg, #F8CB7F 0%, #E8924E 100%)',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    marginTop: 4,
  },
  centerState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '24px 0',
    width: '100%',
  },
  doneIcon: { fontSize: 52 },
  stateText: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    margin: 0,
  },
  stateSub: {
    fontSize: 14,
    color: '#7A7570',
    fontFamily: 'var(--font)',
    margin: 0,
  },
}
