type Props = {
  architecture: string
}

function ArchitectureDiagram({ architecture }: Props) {
  return (
    <div className="technology-notes-card">
      <p className="technology-detail-label">Architecture</p>
      <h3 className="technology-notes-title" style={{ marginTop: '14px' }}>System overview</h3>
      <p className="technology-notes-copy" style={{ marginTop: '12px' }}>{architecture}</p>
    </div>
  )
}

export default ArchitectureDiagram
