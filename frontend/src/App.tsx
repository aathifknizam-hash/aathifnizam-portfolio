import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/layout/Footer'
import PageContainer from './components/layout/PageContainer'
import LandingPage from './pages/LandingPage'
import ProjectPage from './pages/ProjectPage'
import TechnologyPage from './pages/TechnologyPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const location = useLocation()
  const isTechnologyPage = location.pathname.startsWith('/technology/')
  const isProjectPage = location.pathname.startsWith('/project/')
  const isSpecialPage = isTechnologyPage || isProjectPage

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="main-shell">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/project/:projectId"
            element={<ProjectPage />}
          />

          <Route
            path="/technology/:technologyId"
            element={<TechnologyPage />}
          />

          <Route
            path="*"
            element={
              <PageContainer>
                <NotFoundPage />
              </PageContainer>
            }
          />
        </Routes>
      </main>
      {!isSpecialPage ? <Footer /> : null}
    </div>
  )
}

export default App
