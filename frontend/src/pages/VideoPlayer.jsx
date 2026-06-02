import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function VideoPlayer() {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(32)
  const [duration] = useState(90)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= duration) {
            setIsPlaying(false)
            return duration
          }
          return p + 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, duration])

  const fmtTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const handleSeek = (e) => {
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    setProgress(Math.round(ratio * duration))
  }

  return (
    <div style={styles.container}>
      <Header showBack showCall showHome />

      {/* Video area */}
      <div style={styles.videoArea} onClick={() => setIsPlaying(v => !v)}>
        <div style={{...styles.videoBg, ...styles.checkered}} />

        {/* Play/Pause overlay */}
        <button
          style={{...styles.playBtn, ...(isPlaying ? styles.playBtnVisible : styles.playBtnVisible)}}
          onClick={(e) => { e.stopPropagation(); setIsPlaying(v => !v) }}
        >
          <span style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</span>
        </button>

        {/* Controls bar */}
        <div style={styles.controls} onClick={(e) => e.stopPropagation()}>
          <button style={styles.ctrlBtn} onClick={() => setIsPlaying(v => !v)}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button style={styles.ctrlBtn}>🔊</button>
          <span style={styles.timeDisplay}>
            {fmtTime(progress)} / {fmtTime(duration)}
          </span>

          {/* Progress bar */}
          <div style={styles.progressWrap} onClick={handleSeek}>
            <div style={styles.progressBg} />
            <div style={{...styles.progressFill, width: `${(progress / duration) * 100}%`}} />
            <div style={{...styles.progressThumb, left: `calc(${(progress / duration) * 100}% - 8px)`}} />
          </div>

          <button style={styles.ctrlBtn}>⊟</button>
          <button style={styles.ctrlBtn}>⚙</button>
          <button style={styles.ctrlBtn}>⛶</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    background: '#F2EFE8',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  videoArea: {
    flex: 1,
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  videoBg: {
    position: 'absolute',
    inset: 0,
  },
  checkered: {
    backgroundImage: 'linear-gradient(45deg, #d4d0c8 25%, transparent 25%), linear-gradient(-45deg, #d4d0c8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4d0c8 75%), linear-gradient(-45deg, transparent 75%, #d4d0c8 75%)',
    backgroundSize: '28px 28px',
    backgroundPosition: '0 0, 0 14px, 14px -14px, -14px 0px',
    backgroundColor: '#e8e4dc',
  },
  playBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(100, 95, 90, 0.7)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 5,
  },
  playBtnVisible: {
    opacity: 1,
  },
  playIcon: {
    fontSize: 28,
    color: '#fff',
    marginLeft: 4,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(240,236,228,0.92)',
    backdropFilter: 'blur(8px)',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  ctrlBtn: {
    background: 'none',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    color: '#2A2720',
    padding: '2px 4px',
    flexShrink: 0,
  },
  timeDisplay: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2A2720',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  progressWrap: {
    flex: 1,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  progressBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    background: 'rgba(0,0,0,0.15)',
    borderRadius: 2,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    background: '#2A2720',
    borderRadius: 2,
    transition: 'width 0.3s linear',
  },
  progressThumb: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#2A2720',
    transition: 'left 0.3s linear',
  },
}
