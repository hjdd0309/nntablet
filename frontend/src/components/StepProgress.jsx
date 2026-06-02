import { useT } from '../i18n'

export default function StepProgress({ currentStep = 0 }) {
  const t = useT()
  const STEPS = [
    { labelKey: 'stepOverview', icon: '✦' },
    { labelKey: 'stepProcessLog', icon: '❋' },
    { labelKey: 'stepChooseDesign', icon: '✿' },
    { labelKey: 'stepSketching', icon: '◉' },
    { labelKey: 'stepHandcrafting', icon: '☁' },
    { labelKey: 'stepSelectPackage', icon: '❄' },
    { labelKey: 'stepCompletion', icon: '✕' },
  ]

  return (
    <div style={styles.container}>
      {STEPS.map((step, idx) => {
        const isActive = idx === currentStep
        const isPast = idx < currentStep
        return (
          <div key={step.labelKey} style={styles.step}>
            <div style={{
              ...styles.icon,
              ...(isActive ? styles.iconActive : {}),
              ...(isPast ? styles.iconPast : {}),
            }}>
              {step.icon}
            </div>
            <span style={{
              ...styles.label,
              ...(isActive ? styles.labelActive : {}),
              ...(isPast ? styles.labelPast : {}),
            }}>
              {t[step.labelKey]}
            </span>
          </div>
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
    padding: '12px 24px',
    flexShrink: 0,
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '0 14px',
    position: 'relative',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    background: 'rgba(210, 205, 200, 0.4)',
    color: '#B0ABA6',
    transition: 'all 0.3s',
  },
  iconActive: {
    background: 'linear-gradient(135deg, #F8CB7F 0%, #E8924E 100%)',
    color: '#fff',
    boxShadow: '0 3px 12px rgba(232, 146, 78, 0.4)',
    transform: 'scale(1.1)',
  },
  iconPast: {
    background: 'rgba(232, 146, 78, 0.2)',
    color: '#E8924E',
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: '#ADA9A4',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  labelActive: {
    color: '#2A2720',
  },
  labelPast: {
    color: '#E8924E',
  },
}
