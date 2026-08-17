import type { Technology } from '../../types/technology'

type Props = {
  technology: Technology
}

function TechnologyHeader({ technology }: Props) {
  return (
    <section className="technology-hero-card">
      <div className="technology-hero-inner">
        <p className="technology-eyebrow">Technology</p>
        <h1>{technology.name}</h1>
        <p className="technology-description">{technology.description}</p>
        <p className="technology-highlight">{technology.highlight}</p>
      </div>
    </section>
  )
}

export default TechnologyHeader
