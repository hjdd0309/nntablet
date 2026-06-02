import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/language'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={styles.container} onClick={() => navigate('/language')}>
      <div style={styles.logoWrap}>
        <span style={styles.logo}>나녕</span>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    background: '#FAF8F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: "'Nanum Brush Script', cursive",
    fontSize: 80,
    color: '#2A2720',
    letterSpacing: 2,
    userSelect: 'none',
  },
}
