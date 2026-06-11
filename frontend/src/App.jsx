import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { supabase } from './lib/supabase'
import AskForHelpModal from './components/modals/AskForHelpModal'
import SplashScreen from './pages/SplashScreen'
import LanguageSelect from './pages/LanguageSelect'
import StateSelect from './pages/StateSelect'
import WorkshopSelect from './pages/WorkshopSelect'
import WorkshopOverview from './pages/WorkshopOverview'
import InformationPage from './pages/InformationPage'
import ChooseDesign from './pages/ChooseDesign'
import SketchingPage from './pages/SketchingPage'
import ProcessLog from './pages/ProcessLog'
import CraftingPage from './pages/CraftingPage'
import PackagePage from './pages/PackagePage'
import CompletionPage from './pages/CompletionPage'
import Gallery from './pages/Gallery'
import WhatIsChilboPage from './pages/WhatIsChilboPage'
import FrameSelectPage from './pages/FrameSelectPage'
import SessionView from './pages/SessionView'
import ProcessResultPage from './pages/ProcessResultPage'
import PhotoPromptOverlay from './components/PhotoPromptOverlay'
import './App.css'

function AppRoutes() {
  const location = useLocation()
  const { showHelpModal, setShowHelpModal } = useApp()
  return (
    <div className="app-container">
      <div key={location.pathname} className="page-enter">
        <Routes location={location}>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/state" element={<StateSelect />} />
          <Route path="/workshops" element={<WorkshopSelect />} />
          <Route path="/overview" element={<WorkshopOverview />} />
          <Route path="/info" element={<InformationPage />} />
          <Route path="/choose-design" element={<ChooseDesign />} />
          <Route path="/sketch" element={<SketchingPage />} />
          <Route path="/process-log" element={<ProcessLog />} />
          <Route path="/crafting" element={<CraftingPage />} />
          <Route path="/package" element={<PackagePage />} />
          <Route path="/completion" element={<CompletionPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/what-is-chilbo" element={<WhatIsChilboPage />} />
          <Route path="/view/:token" element={<SessionView />} />
          <Route path="/frame-select" element={<FrameSelectPage />} />
          <Route path="/process-result" element={<ProcessResultPage />} />
        </Routes>
      </div>
      {showHelpModal && <AskForHelpModal onClose={() => setShowHelpModal(false)} />}
      <PhotoPromptOverlay />
    </div>
  )
}

async function cleanupExpiredSessions() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: sessions } = await supabase
    .from('craft_sessions')
    .select('session_token')
    .lt('created_at', today.toISOString())

  if (!sessions || sessions.length === 0) return

  for (const { session_token } of sessions) {
    const { data: files } = await supabase.storage.from('nntablet').list(session_token)
    if (files && files.length > 0) {
      const paths = files.map(f => `${session_token}/${f.name}`)
      await supabase.storage.from('nntablet').remove(paths)
    }
  }

  await supabase.from('craft_sessions')
    .delete()
    .lt('created_at', today.toISOString())
}

export default function App() {
  useEffect(() => {
    cleanupExpiredSessions().catch(() => {})
  }, [])

  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
