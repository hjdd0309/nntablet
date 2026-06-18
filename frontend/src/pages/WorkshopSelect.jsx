import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { workshops } from '../data/workshops'
import { useT } from '../i18n'
import Header from '../components/Header'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MAP_CENTER = [37.28400, 127.01630]

const nearbySpots = [
  {
    category: '관광',
    color: '#4A90D9',
    gradient: 'linear-gradient(135deg, #74B9FF 0%, #4A90D9 100%)',
    items: [
      { id: 's1', name: '화성행궁', desc: '행궁동 투어의 중심지입니다.', lat: 37.2851, lng: 127.0130 },
      { id: 's2', name: '공방거리', desc: '화성행궁 광장 왼편에서 팔달문으로 이어지는 아기자기한 길입니다.', lat: 37.2836, lng: 127.0148 },
      { id: 's3', name: '영동시장', desc: '한복과 포목으로 유명한 대형 전통시장입니다.', lat: 37.2779, lng: 127.0160 },
    ],
  },
  {
    category: '체험',
    color: '#9B59B6',
    gradient: 'linear-gradient(135deg, #D7ABF5 0%, #9B59B6 100%)',
    items: [
      { id: 's4', name: '나녕공방', desc: '칠보공예를 직접 체험할 수 있는 공방입니다.', lat: 37.28472, lng: 127.01638 },
      { id: 's8', name: '장금이공방', desc: '공방거리 골목 안쪽의 전통문화 체험공방입니다.', lat: 37.2840, lng: 127.0130 },
    ],
  },
  {
    category: '먹거리',
    color: '#E74C3C',
    gradient: 'linear-gradient(135deg, #FF8A80 0%, #E74C3C 100%)',
    items: [
      { id: 's5', name: '통닭거리', desc: '진미통닭, 용성통닭 등이 모여 있는 수원천 변 골목입니다.', lat: 37.2816, lng: 127.0178 },
    ],
  },
  {
    category: '카페',
    color: '#795548',
    gradient: 'linear-gradient(135deg, #BCAAA4 0%, #795548 100%)',
    items: [
      { id: 's6', name: '행궁다과', desc: '전통 한과 명인이 운영하는 떡·차 디저트 카페입니다.', lat: 37.2847, lng: 127.0135 },
      { id: 's7', name: '메가MGC커피', desc: '공방거리 초입에 위치한 화성행궁점입니다.', lat: 37.2845, lng: 127.0140 },
    ],
  },
]

const allSpots = nearbySpots.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, color: cat.color }))
)

function LeafletMap({ onWorkshopClick, activeId, onSpotClick, activeSpotId, showSpots }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const spotMarkersRef = useRef([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: false }).setView(MAP_CENTER, 16)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    mapRef.current = map

    if (!showSpots) {
      workshops.forEach((w) => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="background:#2A2720;color:#FAF8F2;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);font-family:sans-serif;">${w.name}</div>
            <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #2A2720;margin-top:-1px;"></div>
          </div>`,
          iconAnchor: [0, 0],
        })
        const marker = L.marker([w.lat, w.lng], { icon }).addTo(map)
        marker.on('click', () => onWorkshopClick(w))
        markersRef.current.push({ id: w.id, marker, latlng: [w.lat, w.lng] })
      })
    }

    if (showSpots) {
      allSpots.forEach((s) => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="background:${s.color};color:#fff;padding:4px 10px;border-radius:14px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);font-family:sans-serif;">${s.name}</div>
            <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${s.color};margin-top:-1px;"></div>
          </div>`,
          iconAnchor: [0, 0],
        })
        const marker = L.marker([s.lat, s.lng], { icon }).addTo(map)
        marker.on('click', () => onSpotClick(s))
        spotMarkersRef.current.push({ id: s.id, marker, latlng: [s.lat, s.lng] })
      })
    }

    return () => { map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !activeId) return
    const found = markersRef.current.find((m) => m.id === activeId)
    if (found) mapRef.current.panTo(found.latlng)
  }, [activeId])

  useEffect(() => {
    if (!mapRef.current || !activeSpotId) return
    const found = spotMarkersRef.current.find((m) => m.id === activeSpotId)
    if (found) mapRef.current.panTo(found.latlng)
  }, [activeSpotId])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default function WorkshopSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  const isExplore = location.state?.explore === true
  const { setSelectedWorkshop, language } = useApp()
  const t = useT()
  const isKo = language === '한국어'
  const [activeId, setActiveId] = useState(null)
  const [activeSpotId, setActiveSpotId] = useState(null)

  const handleSelect = (workshop) => {
    setActiveId(workshop.id)
    setSelectedWorkshop(workshop)
    navigate('/overview')
  }

  const handleMarkerClick = (workshop) => {
    setActiveId(workshop.id)
    setSelectedWorkshop(workshop)
  }

  const handleSpotClick = (spot) => {
    setActiveSpotId(spot.id)
  }

  return (
    <div style={styles.container}>
      <Header showBack showCall showHome />
      <div style={styles.mapRow}>

        {/* Left panel */}
        <div style={styles.listPanel}>
          {isExplore ? (
            <>
              <h2 style={styles.listTitle}>사장님 추천 주변 콘텐츠</h2>
              <div style={styles.list}>
                {nearbySpots.map((cat) => (
                  <div key={cat.category} style={styles.categoryGroup}>
                    <div style={{ ...styles.categoryLabel, color: cat.color }}>
                      {cat.category}
                    </div>
                    {cat.items.map((item) => (
                      <button
                        key={item.id}
                        style={{
                          ...styles.workshopCard,
                          ...(activeSpotId === item.id
                            ? { ...styles.workshopCardActive, border: `2px solid ${cat.color}` }
                            : {}),
                        }}
                        onClick={() => handleSpotClick(item)}
                      >
                        <div style={styles.workshopImg}>
                          <div style={{ ...styles.workshopImgPlaceholder, background: cat.gradient }}>
                            <span style={styles.placeholderText}>{item.name.slice(0, 2)}</span>
                          </div>
                        </div>
                        <div style={styles.workshopInfo}>
                          <span style={styles.workshopName}>{item.name}</span>
                          <span style={styles.spotDesc}>{item.desc}</span>
                        </div>
                        <span style={styles.workshopArrow}>›</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 style={styles.listTitle}>{t.selectWorkshop}</h2>
              <div style={styles.list}>
                {workshops.map((w) => (
                  <button
                    key={w.id}
                    style={{
                      ...styles.workshopCard,
                      ...(activeId === w.id ? styles.workshopCardActive : {}),
                    }}
                    onClick={() => handleSelect(w)}
                    onMouseEnter={() => setActiveId(w.id)}
                  >
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
            </>
          )}
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Map panel */}
        <div style={styles.mapPanel}>
          <LeafletMap
            onWorkshopClick={handleMarkerClick}
            activeId={activeId}
            onSpotClick={handleSpotClick}
            activeSpotId={activeSpotId}
            showSpots={isExplore}
          />

          {!isExplore && activeId && (() => {
            const w = workshops.find((x) => x.id === activeId)
            return (
              <div style={styles.popup}>
                <strong style={styles.popupName}>{isKo ? w.name : w.nameEn}</strong>
                <span style={styles.popupType}>{isKo ? w.type : w.typeEn}</span>
                <button style={styles.popupBtn} onClick={() => handleSelect(w)}>
                  {t.readyToEnjoyBtn} →
                </button>
              </div>
            )
          })()}
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#FAF8F2',
  },
  mapRow: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
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
    marginBottom: 4,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  categoryGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 12,
    paddingLeft: 2,
    fontFamily: 'var(--font)',
  },
  workshopCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: '#fff',
    borderRadius: 16,
    padding: '12px',
    border: '2px solid transparent',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.15s, border-color 0.15s',
    fontFamily: 'var(--font)',
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
  },
  workshopCardActive: {
    border: '2px solid #2A2720',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  },
  workshopImg: {
    width: 72,
    height: 72,
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
    fontSize: 18,
    color: '#fff',
  },
  workshopInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    minWidth: 0,
  },
  workshopName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2A2720',
  },
  workshopType: {
    fontSize: 13,
    color: '#7A7570',
  },
  spotDesc: {
    fontSize: 12,
    color: '#7A7570',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  workshopArrow: {
    fontSize: 22,
    color: '#ADA9A4',
    marginRight: 4,
    flexShrink: 0,
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
  popup: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#fff',
    borderRadius: 20,
    padding: '14px 20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    fontFamily: 'var(--font)',
    whiteSpace: 'nowrap',
    zIndex: 10,
  },
  popupName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2A2720',
  },
  popupType: {
    fontSize: 13,
    color: '#7A7570',
  },
  popupBtn: {
    background: '#2A2720',
    color: '#FAF8F2',
    border: 'none',
    borderRadius: 20,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'var(--font)',
  },
}
