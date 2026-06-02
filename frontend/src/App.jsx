import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import SplashScreen from './pages/SplashScreen'
import LanguageSelect from './pages/LanguageSelect'
import StateSelect from './pages/StateSelect'
import WorkshopSelect from './pages/WorkshopSelect'
import WorkshopOverview from './pages/WorkshopOverview'
import InformationPage from './pages/InformationPage'
import ChooseDesign from './pages/ChooseDesign'
import SketchingPage from './pages/SketchingPage'
import ProcessLog from './pages/ProcessLog'
import Gallery from './pages/Gallery'
import VideoPlayer from './pages/VideoPlayer'
import './App.css'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/video" element={<VideoPlayer />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
