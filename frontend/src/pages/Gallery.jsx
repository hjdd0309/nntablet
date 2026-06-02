import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { galleryItems } from '../data/gallery'
import { useT } from '../i18n'

export default function Gallery() {
  const navigate = useNavigate()
  const t = useT()
  const [items, setItems] = useState(galleryItems)
  const [showMySaved, setShowMySaved] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [filterMode, setFilterMode] = useState('most-liked') // 'most-liked' | 'most-saved'
  const [selectedItem, setSelectedItem] = useState(null)

  const toggleLike = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
        : item
    ))
  }

  const toggleSave = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, saved: !item.saved, saves: item.saved ? item.saves - 1 : item.saves + 1 }
        : item
    ))
  }

  const fmtNum = (n) => n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : n

  const sorted = [...items].sort((a, b) =>
    filterMode === 'most-liked' ? b.likes - a.likes : b.saves - a.saves
  )
  const displayed = showMySaved ? sorted.filter(i => i.saved) : sorted

  return (
    <div style={styles.container}>
      <div style={styles.bgGradient} />
      <Header showBack backTo="/overview" />

      <div style={styles.pageHeader}>
        <h1 style={styles.title}>{t.galleryTitle}</h1>
        <div style={styles.headerActions}>
          <button
            style={{...styles.actionBtn, ...(showMySaved ? styles.actionBtnActive : {})}}
            onClick={() => setShowMySaved(v => !v)}
          >
            {t.mySaved}
          </button>
          <div style={{ position: 'relative' }}>
            <button
              style={{...styles.actionBtn, ...(showFilter ? styles.actionBtnActive : {})}}
              onClick={() => setShowFilter(v => !v)}
            >
              {t.filter}
            </button>
            {showFilter && (
              <div style={styles.filterDropdown}>
                {['most-liked', 'most-saved'].map((f) => (
                  <button
                    key={f}
                    style={{...styles.filterItem, ...(filterMode === f ? styles.filterItemActive : {})}}
                    onClick={() => { setFilterMode(f); setShowFilter(false) }}
                  >
                    {f === 'most-liked' ? t.mostLiked : t.mostSaved}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.grid} onClick={() => setShowFilter(false)}>
        {displayed.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={{...styles.cardImg, background: item.color}}>
              <button style={styles.expandBtn} onClick={() => setSelectedItem(item)}>
                <span style={styles.expandIcon}>↗</span>
                <span style={styles.expandIconSmall}>↙</span>
              </button>
            </div>
            <div style={styles.cardFooter}>
              <button
                style={styles.statBtn}
                onClick={() => toggleLike(item.id)}
              >
                <span style={{ color: item.liked ? '#F5C842' : 'transparent', textShadow: item.liked ? 'none' : '0 0 0 #2A2720', fontSize: 16 }}>
                  {item.liked ? '💛' : '🤍'}
                </span>
                <span style={styles.statNum}>{fmtNum(item.likes)}</span>
              </button>
              <button
                style={styles.statBtn}
                onClick={() => toggleSave(item.id)}
              >
                <span style={{ fontSize: 15 }}>
                  {item.saved ? '🔖' : '🔖'}
                </span>
                <span style={{...styles.statNum, color: item.saved ? '#F5C842' : '#7A7570'}}>{fmtNum(item.saves)}</span>
              </button>
              <span style={styles.username}>@{item.username}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selectedItem && (
        <div style={styles.overlay} onClick={() => setSelectedItem(null)}>
          <div style={styles.detailModal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalCloseBtn} onClick={() => setSelectedItem(null)}>✕</button>
            <div style={{...styles.detailImg, background: selectedItem.color}} />
            <div style={styles.detailFooter}>
              <button style={styles.statBtn} onClick={() => toggleLike(selectedItem.id)}>
                <span style={{ fontSize: 18 }}>{selectedItem.liked ? '💛' : '🤍'}</span>
                <span style={styles.statNumLarge}>{fmtNum(selectedItem.likes)}</span>
              </button>
              <button style={styles.statBtn} onClick={() => toggleSave(selectedItem.id)}>
                <span style={{ fontSize: 16 }}>🔖</span>
                <span style={{...styles.statNumLarge, color: selectedItem.saved ? '#F5C842' : '#7A7570'}}>{fmtNum(selectedItem.saves)}</span>
              </button>
              <span style={styles.usernameDetail}>@{selectedItem.username}</span>
            </div>
          </div>
        </div>
      )}
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
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(248,203,127,0.3) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 28px',
    zIndex: 2,
    flexShrink: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
  },
  headerActions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  actionBtn: {
    padding: '8px 16px',
    borderRadius: 20,
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.08)',
    fontSize: 13,
    fontWeight: 700,
    color: '#2A2720',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  actionBtnActive: {
    background: 'rgba(210,205,200,0.7)',
    border: '1px solid rgba(0,0,0,0.12)',
  },
  filterDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.06)',
    overflow: 'hidden',
    zIndex: 50,
    minWidth: 140,
  },
  filterItem: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: 'none',
    fontSize: 14,
    fontWeight: 600,
    color: '#2A2720',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'var(--font)',
  },
  filterItemActive: {
    background: 'rgba(248,203,127,0.2)',
  },
  grid: {
    flex: 1,
    padding: '0 20px 16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    overflowY: 'auto',
    zIndex: 2,
    alignContent: 'start',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  cardImg: {
    height: 180,
    position: 'relative',
  },
  expandBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'rgba(255,255,255,0.8)',
    border: 'none',
    borderRadius: 8,
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 11,
    flexDirection: 'column',
    gap: 0,
  },
  expandIcon: {
    fontSize: 11,
    lineHeight: 1,
  },
  expandIconSmall: {
    fontSize: 11,
    lineHeight: 1,
  },
  cardFooter: {
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(250,248,242,0.8)',
  },
  statBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
  statNum: {
    fontSize: 13,
    fontWeight: 600,
    color: '#7A7570',
  },
  username: {
    marginLeft: 'auto',
    fontSize: 13,
    fontWeight: 600,
    color: '#7A7570',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    backdropFilter: 'blur(8px)',
  },
  detailModal: {
    width: 700,
    background: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
    position: 'relative',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '2px solid #2A2720',
    background: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    zIndex: 1,
  },
  detailImg: {
    height: 440,
    width: '100%',
  },
  detailFooter: {
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(250,248,242,0.9)',
  },
  statNumLarge: {
    fontSize: 15,
    fontWeight: 700,
    color: '#7A7570',
  },
  usernameDetail: {
    marginLeft: 'auto',
    fontSize: 15,
    fontWeight: 700,
    color: '#2A2720',
  },
}
