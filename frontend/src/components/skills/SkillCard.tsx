import { CSSProperties, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  name: string
  technologyId: string
  detail: string
  featured?: boolean
  isOpen: boolean
  onToggle: () => void
}

function SkillCard({ name, technologyId, detail, featured = false, isOpen, onToggle }: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [scrollState, setScrollState] = useState({ isScrollable: false, offset: 0, duration: 0 })

  useEffect(() => {
    if (!isOpen) {
      setScrollState({ isScrollable: false, offset: 0, duration: 0 })
      return
    }

    const updateScrollState = () => {
      const viewport = viewportRef.current
      const track = trackRef.current

      if (!viewport || !track) {
        return
      }

      const offset = Math.max(0, track.scrollHeight - viewport.clientHeight)
      const isScrollable = offset > 1

      if (!isScrollable) {
        setScrollState({ isScrollable: false, offset: 0, duration: 0 })
        return
      }

      const duration = Math.max(16, Math.min(28, 16 + offset / 28))
      setScrollState({ isScrollable: true, offset, duration })
    }

    const frame = window.requestAnimationFrame(updateScrollState)
    const handleResize = () => updateScrollState()

    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, detail])

  const cardClass = `skill-card${featured ? ' featured' : ''}${isOpen ? ' open' : ''}`
  const trackStyle = scrollState.isScrollable
    ? ({
        ['--skill-scroll-offset' as string]: `${-scrollState.offset}px`,
        ['--skill-scroll-duration' as string]: `${scrollState.duration}s`
      } as CSSProperties)
    : undefined

  return (
    <Link to={`/technology/${technologyId}`} className={cardClass}>
      {featured && (
        <div className="orb-cluster" aria-hidden="true">
          <span className="orb o1" />
          <span className="orb o2" />
          <span className="orb o3" />
        </div>
      )}

      <button
        type="button"
        className="expand-btn"
        aria-expanded={isOpen}
        aria-label={`Toggle ${name} details`}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onToggle()
        }}
      >
        {isOpen ? '×' : '+'}
      </button>

      {isOpen ? (
        <div className="skill-description-viewport" ref={viewportRef}>
          <div
            ref={trackRef}
            className={`skill-description-track${scrollState.isScrollable ? ' is-scrollable' : ''}`}
            style={trackStyle}
          >
            <p>{detail}</p>
          </div>
        </div>
      ) : (
        <span className="skill-name">{name}</span>
      )}
    </Link>
  )
}

export default SkillCard
