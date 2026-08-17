import SkillCard from './SkillCard'

type Item = {
  name: string
  technologyId: string
  detail: string
  featured?: boolean
}

type Props = {
  items: Item[]
  openSkillId: string | null
  onToggle: (technologyId: string) => void
}

function SkillGrid({ items, openSkillId, onToggle }: Props) {
  return (
    <div className="skills-grid">
      {items.map((item) => (
        <SkillCard
          key={item.technologyId}
          name={item.name}
          technologyId={item.technologyId}
          detail={item.detail}
          featured={item.featured}
          isOpen={item.technologyId === openSkillId}
          onToggle={() => onToggle(item.technologyId)}
        />
      ))}
    </div>
  )
}

export default SkillGrid
