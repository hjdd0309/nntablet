import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/로고.png'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/language'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={styles.container} onClick={() => navigate('/language')}>
      <div style={styles.logoWrap}>
        <img src={logo} alt="나녕" style={styles.logo} />
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
    maxWidth: '60%',
    maxHeight: '40%',
    objectFit: 'contain',
    userSelect: 'none',
  },
}
