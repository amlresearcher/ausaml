import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { TypologyExplorer } from './pages/TypologyExplorer'

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<TypologyExplorer />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
