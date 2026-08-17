type Props = {
  stack: string[]
}

function ProjectTechStack({ stack }: Props) {
  return (
    <section className="technology-pipeline-panel">
      <div className="technology-section-title">
        <p className="technology-section-kicker">Stack</p>
        <h2>Tech stack</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {stack.map((item) => (
          <span key={item} className="rounded-full border border-[#c6b8ff]/20 bg-[#120d1d]/80 px-4 py-2 text-sm font-medium text-[#efe8ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}

export default ProjectTechStack
