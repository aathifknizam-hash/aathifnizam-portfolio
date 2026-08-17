import { Link } from 'react-router-dom'
import type { Project } from '../../types/project'

type Props = {
  projectIds: string[]
  projects: Project[]
}

function RelatedProjects({ projectIds, projects }: Props) {
  const matches = projects.filter((project) => projectIds.includes(project.id))

  return (
    <div className="technology-project-list">
      {matches.map((project) => (
        <Link key={project.id} to={`/project/${project.id}`} className="technology-project-card">
          <p className="technology-project-title">{project.title}</p>
          <p className="technology-project-subtitle">{project.subtitle}</p>
        </Link>
      ))}
      {matches.length === 0 ? <p className="technology-empty-copy">No related projects found.</p> : null}
    </div>
  )
}

export default RelatedProjects
