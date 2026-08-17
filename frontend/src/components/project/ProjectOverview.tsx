import type { Project } from '../../types/project'

type Props = {
  project: Project
}

function ProjectOverview({ project }: Props) {
  return (
    <section className="technology-pipeline-panel">
      <div className="technology-section-title">
        <p className="technology-section-kicker">Project</p>
        <h2>Overview</h2>
      </div>
      <p className="technology-stage-copy">{project.summary}</p>
      <div className="technology-pipeline-grid">
        <div className="technology-stage-card">
          <p className="technology-stage-label">Role</p>
          <p className="technology-stage-copy">{project.role}</p>
        </div>
        <div className="technology-stage-card">
          <p className="technology-stage-label">Timeline</p>
          <p className="technology-stage-copy">{project.timeline}</p>
        </div>
        <div className="technology-stage-card">
          <p className="technology-stage-label">Technology</p>
          <p className="technology-stage-copy">{project.stack.join(', ')}</p>
        </div>
      </div>
    </section>
  )
}

export default ProjectOverview
