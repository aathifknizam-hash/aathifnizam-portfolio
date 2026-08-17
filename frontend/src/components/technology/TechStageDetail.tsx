import type { Technology } from '../../types/technology'

type Props = {
  technology: Technology
}

function TechStageDetail({ technology }: Props) {
  return (
    <div className="technology-detail-panel">
      <p className="technology-detail-label">Implementation details</p>
      <ul>
        {technology.useCases.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default TechStageDetail
