type Props = {
  timeline: string
}

function ProjectTimeline({ timeline }: Props) {
  return (
    <section className="technology-pipeline-panel">
      <div className="technology-section-title">
        <p className="technology-section-kicker">Delivery</p>
        <h2>Timeline</h2>
      </div>
      <div className="technology-notes-card">
        <p className="technology-notes-copy">{timeline}</p>
      </div>
    </section>
  )
}

export default ProjectTimeline
