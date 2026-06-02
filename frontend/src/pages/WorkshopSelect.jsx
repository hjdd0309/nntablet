import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { workshops } from '../data/workshops'
import { useT } from '../i18n'

function MapBackground() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 780 770">
      {/* Road network - simplified */}
      <rect width="780" height="770" fill="#F0EBE0" />
      {/* Main roads */}
      <rect x="0" y="220" width="780" height="32" fill="#E8E0D0" />
      <rect x="0" y="380" width="780" height="26" fill="#E8E0D0" />
      <rect x="0" y="540" width="780" height="20" fill="#E8E0D0" />
      <rect x="180" y="0" width="26" height="770" fill="#E8E0D0" />
      <rect x="400" y="0" width="20" height="770" fill="#E8E0D0" />
      <rect x="580" y="0" width="16" height="770" fill="#E8E0D0" />
      {/* Blocks / buildings */}
      <rect x="40" y="40" width="120" height="160" rx="4" fill="#E0D8CC" />
      <rect x="220" y="40" width="150" height="100" rx="4" fill="#E0D8CC" />
      <rect x="220" y="160" width="150" height="40" rx="4" fill="#E0D8CC" />
      <rect x="440" y="40" width="120" height="160" rx="4" fill="#E0D8CC" />
      <rect x="600" y="40" width="160" height="160" rx="4" fill="#E0D8CC" />
      <rect x="40" y="270" width="120" height="90" rx="4" fill="#E0D8CC" />
      <rect x="220" y="270" width="160" height="90" rx="4" fill="#E0D8CC" />
      <rect x="440" y="270" width="110" height="90" rx="4" fill="#E0D8CC" />
      <rect x="600" y="270" width="160" height="90" rx="4" fill="#E0D8CC" />
      <rect x="40" y="420" width="120" height="100" rx="4" fill="#E0D8CC" />
      <rect x="220" y="420" width="160" height="100" rx="4" fill="#E0D8CC" />
      <rect x="440" y="420" width="80" height="100" rx="4" fill="#D4EED4" />
      <rect x="560" y="420" width="60" height="100" rx="4" fill="#D4EED4" />
      <rect x="600" y="420" width="160" height="100" rx="4" fill="#E0D8CC" />
      <rect x="40" y="580" width="120" height="160" rx="4" fill="#E0D8CC" />
      <rect x="220" y="580" width="160" height="160" rx="4" fill="#E0D8CC" />
      <rect x="440" y="580" width="120" height="160" rx="4" fill="#E0D8CC" />
      <rect x="600" y="580" width="160" height="160" rx="4" fill="#E0D8CC" />
      {/* Road labels */}
      <text x="90" y="212" fontSize="10" fill="#9A9490" textAnchor="middle">행궁로22번길</text>
      <text x="90" y="370" fontSize="9" fill="#9A9490" textAnchor="middle">행궁만두</text>
      {/* Map pins for workshops */}
      {workshops.map((w) => (
        <g key={w.id} transform={`translate(${w.x * 7.8}, ${w.y * 7.7})`}>
          <path d="M0,-18 C-10,-18 -18,-10 -18,0 C-18,12 0,28 0,28 C0,28 18,12 18,0 C18,-10 10,-18 0,-18 Z" fill="#2A2720" />
          <circle cx="0" cy="0" r="7" fill="#FAF8F2" />
        </g>
      ))}
      {/* Restaurant/facility pins */}
      <rect x="248" y="100" width="28" height="28" rx="6" fill="#F0A070" />
      <text x="262" y="119" fontSize="14" fill="#fff" textAnchor="middle">🍴</text>
      <rect x="390" y="300" width="28" height="28" rx="6" fill="#F0A070" />
      <text x="404" y="319" fontSize="14" fill="#fff" textAnchor="middle">🍴</text>
      <rect x="490" y="440" width="28" height="28" rx="6" fill="#F0A070" />
      <text x="504" y="459" fontSize="14" fill="#fff" textAnchor="middle">🍴</text>
      <text x="262" y="80" fontSize="10" fill="#6A6460" textAnchor="middle">달보드레 유기농빵</text>
      <text x="390" y="290" fontSize="10" fill="#6A6460" textAnchor="middle">행궁만두</text>
      <text x="490" y="430" fontSize="10" fill="#6A6460" textAnchor="middle">초요이</text>
    </svg>
  )
}

export default function WorkshopSelect() {
  const navigate = useNavigate()
  const { setSelectedWorkshop, language } = useApp()
  const t = useT()
  const isKo = language === '한국어'

  const handleSelect = (workshop) => {
    setSelectedWorkshop(workshop)
    navigate('/overview')
  }

  return (
    <div style={styles.container}>
      {/* Left panel */}
      <div style={styles.listPanel}>
        <h2 style={styles.listTitle}>{t.selectWorkshop}</h2>
        <div style={styles.list}>
          {workshops.map((w) => (
            <button key={w.id} style={styles.workshopCard} onClick={() => handleSelect(w)}>
              <div style={styles.workshopImg}>
                <div style={styles.workshopImgPlaceholder}>
                  {w.id === 1 && <span style={styles.placeholderText}>나녕</span>}
                </div>
              </div>
              <div style={styles.workshopInfo}>
                <span style={styles.workshopName}>{isKo ? w.name : w.nameEn}</span>
                <span style={styles.workshopType}>{isKo ? w.type : w.typeEn}</span>
              </div>
              <span style={styles.workshopArrow}>›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Map panel */}
      <div style={styles.mapPanel}>
        <MapBackground />
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    background: '#FAF8F2',
  },
  listPanel: {
    width: 430,
    flexShrink: 0,
    padding: '28px 24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#2A2720',
    fontFamily: 'var(--font)',
    marginBottom: 8,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  workshopCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: '#fff',
    borderRadius: 16,
    padding: '12px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.15s',
    fontFamily: 'var(--font)',
  },
  workshopImg: {
    width: 120,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
    background: '#F0EDE5',
  },
  workshopImgPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #E8C890 0%, #C8905A 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: "'Nanum Brush Script', cursive",
    fontSize: 22,
    color: '#fff',
  },
  workshopInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  workshopName: {
    fontSize: 17,
    fontWeight: 700,
    color: '#2A2720',
  },
  workshopType: {
    fontSize: 13,
    color: '#7A7570',
  },
  workshopArrow: {
    fontSize: 22,
    color: '#ADA9A4',
    marginRight: 4,
  },
  divider: {
    width: 1,
    background: 'rgba(0,0,0,0.08)',
  },
  mapPanel: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
}
