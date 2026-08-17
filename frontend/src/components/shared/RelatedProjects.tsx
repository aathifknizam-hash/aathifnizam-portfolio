import { Link } from 'react-router-dom'
import type { Project } from '../../types/project'

type Props = {
  projects: Project[]
  currentProjectId?: string
  limit?: number
}

function RelatedProjects({ projects, currentProjectId, limit = 3 }: Props) {
  const matches = projects
    .filter((project) => project.id !== currentProjectId)
    .slice(0, limit)

  return (
    <div className="portfolio-related-list">
      {matches.map((project) => (
        <Link key={project.id} to={`/project/${project.id}`} className="portfolio-related-card">
          <p className="portfolio-related-title">{project.title}</p>
          <p className="portfolio-related-subtitle">{project.subtitle}</p>
        </Link>
      ))}
      {matches.length === 0 ? <p className="portfolio-related-empty">No related projects found.</p> : null}
    </div>
  )
}

export default RelatedProjects
