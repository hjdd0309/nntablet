import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/language'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={styles.container} onClick={() => navigate('/language')} />
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/스플래시.png)',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: '#FAF8F2',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
  },
}
