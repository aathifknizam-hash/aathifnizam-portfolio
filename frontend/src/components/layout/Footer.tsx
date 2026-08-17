function Footer() {
  const items = [
    'Python',
    'React',
    'FastAPI',
    'RAG',
    'ChromaDB',
    'Groq',
    'Django REST',
    'SQL',
    'Generative AI',
    'Sentence Transformers'
  ]

  return (
    <footer className="portfolio-footer">
      <div className="portfolio-marquee" aria-label="Technology stack marquee">
        <div className="marquee-track">
          {[...items, ...items].map((item, index) => (
            <span key={`${item}-${index}`} className="marquee-item">
              {item}
              <span className="marquee-separator">•</span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
