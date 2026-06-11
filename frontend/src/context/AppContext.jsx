import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

export const SHOT_INTERVAL_SECS = 5 * 60 // 5분

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('English')
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [sketchColor, setSketchColor] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [sessionToken, setSessionToken] = useState(null)

  // 촬영 타이머 상태
  const [recordMode, setRecordMode] = useState(null)       // 'auto' | 'alert'
  const [showPhotoPrompt, setShowPhotoPrompt] = useState(false)
  const [nextShotCountdown, setNextShotCountdown] = useState(null) // 초
  const [sessionPhotos, setSessionPhotos] = useState([])
  const [selectedFrame, setSelectedFrame] = useState(null) // 1-5
  // 1초마다 카운트다운
  useEffect(() => {
    if (!recordMode || showPhotoPrompt || nextShotCountdown === null) return
    if (nextShotCountdown <= 0) {
      setShowPhotoPrompt(true)
      return
    }
    const timer = setTimeout(() => setNextShotCountdown(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [recordMode, showPhotoPrompt, nextShotCountdown])

  const startRecording = useCallback((mode) => {
    setRecordMode(mode)
    setNextShotCountdown(SHOT_INTERVAL_SECS)
    setShowPhotoPrompt(false)
    setSessionPhotos([])
  }, [])

  const stopRecording = useCallback(() => {
    setRecordMode(null)
    setNextShotCountdown(null)
    setShowPhotoPrompt(false)
  }, [])

  const resetSession = useCallback(() => {
    setSessionToken(null)
    setRecordMode(null)
    setNextShotCountdown(null)
    setShowPhotoPrompt(false)
    setSessionPhotos([])
    setSelectedFrame(null)
    setSelectedDesign(null)
    setSelectedWorkshop(null)
    setSketchColor(null)
    setCurrentStep(0)
  }, [])

  const dismissPhotoPrompt = useCallback(() => {
    setShowPhotoPrompt(false)
    setNextShotCountdown(SHOT_INTERVAL_SECS)
  }, [])

  const addSessionPhoto = useCallback((url) => {
    setSessionPhotos(prev => [...prev, url])
    setShowPhotoPrompt(false)
    setNextShotCountdown(SHOT_INTERVAL_SECS)
  }, [])

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      selectedWorkshop, setSelectedWorkshop,
      selectedDesign, setSelectedDesign,
      sketchColor, setSketchColor,
      currentStep, setCurrentStep,
      showHelpModal, setShowHelpModal,
      sessionToken, setSessionToken,
      selectedFrame, setSelectedFrame,
      recordMode,
      showPhotoPrompt,
      nextShotCountdown,
      sessionPhotos,
      startRecording,
      stopRecording,
      resetSession,
      dismissPhotoPrompt,
      addSessionPhoto,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
