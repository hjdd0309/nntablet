import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
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
import VideoPlayer from './pages/VideoPlayer'
import './App.css'

function AppRoutes() {
  const { showHelpModal, setShowHelpModal } = useApp()
  return (
    <div className="app-container">
      <Routes>
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
        <Route path="/video" element={<VideoPlayer />} />
      </Routes>
      {showHelpModal && <AskForHelpModal onClose={() => setShowHelpModal(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
