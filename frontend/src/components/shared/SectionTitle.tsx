type Props = {
  title: string
  subtitle?: string
}

function SectionTitle({ title, subtitle }: Props) {
  return (
    <div className="technology-section-title">
      <p className="technology-section-kicker">Section</p>
      <h2>{title}</h2>
      {subtitle ? <p className="technology-section-subtitle">{subtitle}</p> : null}
    </div>
  )
}

export default SectionTitle
