import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProjectOverview from '../components/project/ProjectOverview'
import ProjectTechStack from '../components/project/ProjectTechStack'
import ProjectTimeline from '../components/project/ProjectTimeline'
import ProjectAskWidget from '../components/project/ProjectAskWidget'
import Challenges from '../components/project/Challenges'
import ArchitectureDiagram from '../components/project/ArchitectureDiagram'
import DatabaseDiagram from '../components/project/DatabaseDiagram'
import RelatedProjects from '../components/shared/RelatedProjects'
import SectionTitle from '../components/shared/SectionTitle'
import InteractiveNetworkBackground from '../components/shared/InteractiveNetworkBackground'
import { projects } from '../data/projects'

function ProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const project = useMemo(
    () => projects.find((item) => item.id === projectId),
    [projectId]
  )

  if (!project) {
    return (
      <>
        <InteractiveNetworkBackground variant="project" />
        <div className="portfolio-page-shell">
          <div className="portfolio-page-main">
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Project not found</h2>
              <p style={{ color: 'rgba(244, 240, 255, 0.68)', marginBottom: '28px' }}>
                Please choose a valid project from the homepage.
              </p>
              <button
                onClick={() => navigate(-1)}
                className="portfolio-back-button"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <InteractiveNetworkBackground variant="project" />
      
      <div className="portfolio-page-shell">
        <div className="portfolio-page-main">
          <button
            onClick={() => navigate(-1)}
            className="portfolio-back-button"
            style={{ marginBottom: '40px' }}
          >
            ← Back
          </button>

          <section className="portfolio-hero">
            <div className="portfolio-hero-inner">
              <p className="portfolio-eyebrow">{project.role}</p>
              <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.3rem)' }}>{project.title}</h1>
              <p className="portfolio-description">{project.subtitle}</p>
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', marginBottom: '60px' }}>
            <div>
              <ProjectOverview project={project} />
              <div style={{ marginTop: '40px' }}>
                <ProjectTechStack stack={project.stack} />
              </div>
              <div style={{ marginTop: '40px' }}>
                <ProjectTimeline timeline={project.timeline} />
              </div>
              <div style={{ marginTop: '40px' }}>
                <Challenges challenges={project.challenges} />
              </div>
            </div>

            <div>
              <div style={{ position: 'sticky', top: '100px' }}>
                <h3 className="portfolio-section-title">AI Project Assistant</h3>
                <p className="portfolio-section-subtitle" style={{ marginBottom: '24px' }}>
                  Ask a question about this project and get a source-aware answer from the knowledge base.
                </p>
                <ProjectAskWidget projectId={project.id} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', marginBottom: '80px' }}>
            <div>
              <ArchitectureDiagram architecture={project.architecture} />
            </div>
            <div>
              <DatabaseDiagram database={project.database} />
            </div>
          </div>

          <section className="portfolio-related-section">
            <h2 className="portfolio-section-title">Related Projects</h2>
            <RelatedProjects projects={projects} currentProjectId={project.id} limit={3} />
          </section>
        </div>
      </div>
    </>
  )
}

export default ProjectPage
