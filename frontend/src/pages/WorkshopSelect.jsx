import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { workshops } from '../data/workshops'
import { useT } from '../i18n'
import Header from '../components/Header'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MAP_CENTER = [37.28400, 127.01630]

function LeafletMap({ onWorkshopClick, activeId }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: false }).setView(MAP_CENTER, 16)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    mapRef.current = map

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

    return () => { map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !activeId) return
    const found = markersRef.current.find((m) => m.id === activeId)
    if (found) mapRef.current.panTo(found.latlng)
  }, [activeId])

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

  const handleSelect = (workshop) => {
    setActiveId(workshop.id)
    setSelectedWorkshop(workshop)
    if (!isExplore) navigate('/overview')
  }

  const handleMarkerClick = (workshop) => {
    setActiveId(workshop.id)
    setSelectedWorkshop(workshop)
  }

  return (
    <div style={styles.container}>
      <Header showBack showCall showHome />
      <div style={styles.mapRow}>
      {/* Left panel */}
      <div style={styles.listPanel}>
        <h2 style={styles.listTitle}>{isExplore ? t.exploreNearby : t.selectWorkshop}</h2>
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
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Map panel */}
      <div style={styles.mapPanel}>
        <LeafletMap onWorkshopClick={handleMarkerClick} activeId={activeId} />

        {/* Active workshop popup */}
        {activeId && (() => {
          const w = workshops.find((x) => x.id === activeId)
          return (
            <div style={styles.popup}>
              <strong style={styles.popupName}>{isKo ? w.name : w.nameEn}</strong>
              <span style={styles.popupType}>{isKo ? w.type : w.typeEn}</span>
              {!isExplore && (
                <button style={styles.popupBtn} onClick={() => handleSelect(w)}>
                  {t.readyToEnjoyBtn} →
                </button>
              )}
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
    border: '2px solid transparent',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.15s, border-color 0.15s',
    fontFamily: 'var(--font)',
  },
  workshopCardActive: {
    border: '2px solid #2A2720',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
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
