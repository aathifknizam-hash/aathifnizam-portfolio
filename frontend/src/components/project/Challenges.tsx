type Props = {
  challenges: string[]
}

function Challenges({ challenges }: Props) {
  return (
    <section className="technology-pipeline-panel">
      <div className="technology-section-title">
        <p className="technology-section-kicker">Constraints</p>
        <h2>Challenges</h2>
      </div>
      <ul className="technology-detail-panel" style={{ listStyle: 'disc' }}>
        {challenges.map((challenge) => (
          <li key={challenge} className="technology-notes-copy">
            {challenge}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Challenges
