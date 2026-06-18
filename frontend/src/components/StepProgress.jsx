import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n'

const STEPS = [
  { labelKey: 'stepOverview',      route: '/overview' },
  { labelKey: 'stepProcessLog',    route: '/process-log' },
  { labelKey: 'stepChilboVideo',   route: '/choose-design' },
  { labelKey: 'stepGallery',       route: '/gallery' },
  { labelKey: 'stepHandcrafting',  route: '/crafting' },
  { labelKey: 'stepSelectPackage', route: '/package' },
  { labelKey: 'stepCompletion',    route: '/completion' },
]

export default function StepProgress({ currentStep = 0 }) {
  const t = useT()
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      {STEPS.map((step, idx) => {
        const isActive = idx === currentStep
        const isPast = idx < currentStep
        const isSelected = isActive || isPast
        const imgSrc = isSelected ? `/${idx + 1}.png` : `/${idx + 1}_.png`
        return (
          <button
            key={step.labelKey}
            className="step-btn"
            style={{
              ...styles.step,
              ...(isActive ? styles.stepActive : {}),
            }}
            onClick={() => navigate(step.route, { state: { fromFlow: true } })}
          >
            <div style={{
              ...styles.icon,
              ...(isActive ? styles.iconActive : {}),
              ...(isPast ? styles.iconPast : {}),
            }}>
              <img src={imgSrc} alt="" style={styles.iconImg} />
            </div>
            <span style={{
              ...styles.label,
              ...(isActive ? styles.labelActive : {}),
              ...(isPast ? styles.labelPast : {}),
            }}>
              {t[step.labelKey]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 0,
    padding: '16px 24px 8px',
    flexShrink: 0,
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '0 14px',
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 12,
    transition: 'background 0.15s',
  },
  stepActive: {
    borderBottom: '2px solid #ADA9A4',
  },
  icon: {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
  },
  iconImg: {
    width: 44,
    height: 44,
    objectFit: 'contain',
    display: 'block',
  },
  iconActive: {
    transform: 'scale(1.1)',
  },
  iconPast: {},
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: '#ADA9A4',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  labelActive: {
    color: '#2A2720',
    fontWeight: 700,
  },
  labelPast: {
    color: '#2A2720',
  },
}
