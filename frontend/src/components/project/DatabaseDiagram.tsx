type Props = {
  database: string
}

function DatabaseDiagram({ database }: Props) {
  return (
    <div className="technology-notes-card">
      <p className="technology-detail-label">Database</p>
      <h3 className="technology-notes-title" style={{ marginTop: '14px' }}>Storage model</h3>
      <p className="technology-notes-copy" style={{ marginTop: '12px' }}>{database}</p>
    </div>
  )
}

export default DatabaseDiagram
