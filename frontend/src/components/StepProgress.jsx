import { useT } from '../i18n'

export default function StepProgress({ currentStep = 0 }) {
  const t = useT()
  const STEPS = [
    { labelKey: 'stepOverview' },
    { labelKey: 'stepProcessLog' },
    { labelKey: 'stepChilboVideo' },
    { labelKey: 'stepGallery' },
    { labelKey: 'stepHandcrafting' },
    { labelKey: 'stepSelectPackage' },
    { labelKey: 'stepCompletion' },
  ]

  return (
    <div style={styles.container}>
      {STEPS.map((step, idx) => {
        const isActive = idx === currentStep
        const isPast = idx < currentStep
        const isSelected = isActive || isPast
        const imgSrc = isSelected ? `/${idx + 1}.png` : `/${idx + 1}_.png`
        return (
          <div key={step.labelKey} style={styles.step}>
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
