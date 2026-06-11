import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'

const FRAMES = [1, 2, 3, 4, 5]

export default function FrameSelectPage() {
  const navigate = useNavigate()
  const { selectedFrame, setSelectedFrame } = useApp()

  return (
    <div style={s.container}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/7_기록.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <Header showBack backTo="/completion" showCall showHome />

      <div style={s.content}>
        <h1 style={s.title}>프레임을 골라주세요</h1>
        <p style={s.sub}>선택한 프레임이 사진 위에 적용돼요</p>

        <div style={s.frameRow}>
          {FRAMES.map(n => (
            <button
              key={n}
              style={{
                ...s.frameBtn,
                ...(selectedFrame === n ? s.frameBtnActive : {}),
              }}
              onClick={() => setSelectedFrame(n)}
            >
              <div style={{
                ...s.frameImgWrap,
                ...(selectedFrame === n ? s.frameImgWrapActive : {}),
              }}>
                <div style={s.frameImgBg} />
                <img
                  src={`/프레임${n}.png`}
                  alt={`프레임 ${n}`}
                  style={s.frameImg}
                />
              </div>
              <span style={{ ...s.frameNum, ...(selectedFrame === n ? s.frameNumActive : {}) }}>
                {n}
              </span>
            </button>
          ))}
        </div>

        <button
          style={{ ...s.nextBtn, ...(selectedFrame ? {} : s.nextBtnDisabled) }}
          onClick={() => selectedFrame && navigate('/process-result')}
        >
          다음 →
        </button>
      </div>
    </div>
  )
}

const s = {
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
    gap: 20,
    zIndex: 2,
    padding: '16px 40px 32px',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    margin: 0,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: '#7A7570',
    fontFamily: 'var(--font)',
    margin: 0,
    textAlign: 'center',
  },
  frameRow: {
    display: 'flex',
    gap: 16,
    width: '100%',
    alignItems: 'stretch',
  },
  frameBtn: {
    flex: 1,
    minWidth: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    outline: 'none',
  },
  frameBtnActive: {},
  frameImgWrapActive: {
    outline: '3px solid #E8924E',
    outlineOffset: 2,
    boxShadow: '0 0 0 4px rgba(232,146,78,0.2), 0 4px 16px rgba(0,0,0,0.12)',
  },
  frameImgWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '4 / 3',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  },
  frameImgBg: {
    position: 'absolute',
    inset: 0,
    background: '#FAF8F2',
  },
  frameImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  frameNum: {
    fontSize: 13,
    fontWeight: 600,
    color: '#ADA9A4',
    fontFamily: 'var(--font)',
  },
  frameNumActive: {
    color: '#E8924E',
    fontWeight: 700,
  },
  nextBtn: {
    marginTop: 8,
    padding: '14px 56px',
    borderRadius: 30,
    background: 'linear-gradient(135deg, #F8CB7F 0%, #E8924E 100%)',
    border: 'none',
    fontSize: 18,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    boxShadow: '0 4px 16px rgba(232,146,78,0.35)',
  },
  nextBtnDisabled: {
    background: 'rgba(0,0,0,0.08)',
    color: '#ADA9A4',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },
}
