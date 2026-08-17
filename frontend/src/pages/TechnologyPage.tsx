import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import InteractiveNetworkBackground from '../components/shared/InteractiveNetworkBackground'
import { projects } from '../data/projects'
import { technologies } from '../data/technologies'
import './TechnologyPage.css'

function TechnologyPage() {
  const { technologyId } = useParams()
  const navigate = useNavigate()

  const technology = useMemo(
    () => technologies.find((item) => item.id === technologyId),
    [technologyId]
  )

  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  if (!technology) {
    return (
      <>
        <InteractiveNetworkBackground variant="technology" />
        <div className="tech-page-shell">
          <main className="tech-main">
            <div className="tech-empty-state">
              <h2>Technology not found</h2>
              <p>Choose another technology from the homepage to continue.</p>
              <button onClick={() => navigate(-1)} className="tech-back-button">
                ← Back
              </button>
            </div>
          </main>
        </div>
      </>
    )
  }

  const relatedProjectsList = projects.filter((project) => {
    if (technology.relatedProjects && technology.relatedProjects.includes(project.id)) return true
    if (project.relatedTechnologies && project.relatedTechnologies.includes(technology.id)) return true

    const baseId = technology.id.split('-')[0]
    if (project.relatedTechnologies && project.relatedTechnologies.includes(baseId)) return true

    const techName = (technology.name || '').toLowerCase()
    const hay = (
      (project.title || '') +
      ' ' +
      (project.subtitle || '') +
      ' ' +
      (project.summary || '') +
      ' ' +
      ((project.highlights && project.highlights.join(' ')) || '') +
      ' ' +
      ((project.stack && project.stack.join(' ')) || '')
    ).toLowerCase()

    return techName.length > 0 && hay.includes(techName)
  })

  return (
    <>
      <InteractiveNetworkBackground variant="technology" />

      <div className="tech-page-shell">
        <main className="tech-main">
          <button onClick={() => navigate(-1)} className="tech-back-button">
            ← Back
          </button>

          <section className="tech-hero">
            <div className="tech-hero-inner">
              <p className="tech-eyebrow">Technology</p>
              <h1 className="tech-title">{technology.name}</h1>
              <p className="tech-description">{technology.description}</p>
              <p className="tech-highlight">{technology.highlight}</p>
            </div>
          </section>

          <p className="tech-hint">Click each use case to explore.</p>

          <div className="tech-grid">
            {technology.useCases.map((useCase) => {
              const hasMatch = relatedProjectsList.length > 0
              const matches = hasMatch
                ? relatedProjectsList.filter((project) => {
                    const hay = (
                      (project.title || '') +
                      ' ' +
                      (project.subtitle || '') +
                      ' ' +
                      (project.summary || '') +
                      ' ' +
                      ((project.highlights && project.highlights.join(' ')) || '')
                    ).toLowerCase()
                    return hay.includes(useCase.toLowerCase())
                  })
                : []

              const list = matches.length ? matches : relatedProjectsList

              return (
                <div
                  key={useCase}
                  className={`tech-card ${activeSkill === useCase ? 'active' : ''}`}
                  onClick={() => setActiveSkill(activeSkill === useCase ? null : useCase)}
                  data-network-magnet="true"
                  data-use-case={useCase}
                >
                  <div className="tech-card-plus">+</div>
                  <div className="tech-card-label">{useCase}</div>
                  <div className="tech-card-reveal">
                    <div className="tech-card-eyebrow">Use case</div>
                    <div className="tech-card-proj">{useCase}</div>
                    <div className="tech-card-desc">
                      {list.length === 0 ? (
                        <div className="tech-reveal-empty">No project-specific examples available for this use case.</div>
                      ) : (
                        <div className="tech-reveal-list">
                          {list.slice(0, 3).map((project) => (
                            <div key={project.id} className="tech-reveal-project">
                              <div className="tech-reveal-proj-title">{project.title}</div>
                              <div className="tech-reveal-proj-sub">{project.subtitle || project.summary || ''}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <section className="tech-related-section">
            <h2 className="tech-section-title">Related Projects</h2>
            <div className="tech-related-list">
              {relatedProjectsList.map((project) => (
                <Link key={project.id} to={`/project/${project.id}`} className="tech-related-card">
                  <div className="tech-related-title">{project.title}</div>
                  <div className="tech-related-subtitle">{project.subtitle}</div>
                </Link>
              ))}
              {relatedProjectsList.length === 0 && <p className="tech-related-empty">No related projects</p>}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default TechnologyPage
