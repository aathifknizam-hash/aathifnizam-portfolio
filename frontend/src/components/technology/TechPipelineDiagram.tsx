import type { Technology } from '../../types/technology'

type Props = {
  technology: Technology
}

function TechPipelineDiagram({ technology }: Props) {
  return (
    <div className="technology-pipeline-panel">
      <div className="technology-pipeline-grid">
        <div className="technology-stage-card">
          <p className="technology-stage-label">Discover</p>
          <p className="technology-stage-copy">Collect and organize project knowledge for fast retrieval.</p>
        </div>
        <div className="technology-stage-card">
          <p className="technology-stage-label">Search</p>
          <p className="technology-stage-copy">Use embeddings and vector search to surface relevant content.</p>
        </div>
        <div className="technology-stage-card">
          <p className="technology-stage-label">Deliver</p>
          <p className="technology-stage-copy">Synthesize results into a concise answer with source references.</p>
        </div>
      </div>
      <div className="technology-notes-card">
        <p className="technology-notes-title">Why this matters</p>
        <p className="technology-notes-copy">{technology.useCases.join(' • ')}</p>
      </div>
    </div>
  )
}

export default TechPipelineDiagram
