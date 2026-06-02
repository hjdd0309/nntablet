import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('English')
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [sketchColor, setSketchColor] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showHelpModal, setShowHelpModal] = useState(false)

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      selectedWorkshop, setSelectedWorkshop,
      selectedDesign, setSelectedDesign,
      sketchColor, setSketchColor,
      currentStep, setCurrentStep,
      showHelpModal, setShowHelpModal,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
