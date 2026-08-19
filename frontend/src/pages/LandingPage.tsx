import { CSSProperties, FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChat } from '../hooks/useChat'
import SkillGrid from '../components/skills/SkillGrid'
import InteractiveNetworkBackground from '../components/shared/InteractiveNetworkBackground'
import './LandingPage.css'

type SkillItem = {
  technologyId: string
  name: string
  detail: string
  featured?: boolean
}

type FaqItem = {
  query: string
  display: string
}

const skillItems: SkillItem[] = [
  {
    technologyId: 'generative-ai',
    name: 'Gen AI',
    detail:
      'Generative AI means using large language models to create text, answers, summaries, ideas, and workflows from prompts. It helps products respond naturally, adapt to user intent, and generate useful outputs instead of only returning fixed rules or templates.',
  },
  {
    technologyId: 'rag',
    name: 'RAG',
    detail:
      'RAG stands for Retrieval-Augmented Generation. Instead of relying only on a model’s memory, it retrieves relevant information from documents or a knowledge base first, then asks the model to answer using that context. This makes the output more accurate, grounded, and useful for specific business information.',
  },
  {
    technologyId: 'django-rest',
    name: 'Django REST',
    detail:
      'Django REST Framework is a way to build APIs with Django. It helps create secure, structured backend services for apps, dashboards, authentication, data flows, and integrations. In practice, it powers the logic behind web apps and services that need robust, scalable communication.',
  },
  {
    technologyId: 'graphic-design',
    name: 'Graphic design',
    detail:
      'Graphic design is the visual thinking behind a product: layout, hierarchy, branding, clarity, and user experience. It shapes how a tool feels and communicates, making AI products not just functional but also understandable, polished, and memorable for real users.',
  },
]

const faqItems: FaqItem[] = [
  {
    query: 'faq',
    display: 'thinking about what to ask? here are the FAQs…',
  },
  {
    query: 'what is your process for building products?',
    display: 'what is your process for building products?',
  },
  {
    query: 'how does the chat assistant work?',
    display: 'how does the chat assistant work?',
  },
]

const connectStages = [
  { text: 'Connecting to RAG engine…', width: '30%' },
  { text: 'Loading vector database…', width: '60%' },
  { text: 'Waking the assistant…', width: '85%' },
  { text: 'Ready.', width: '100%' },
]

function LandingPage() {
  const { messages, isLoading, error, sendMessage, selectSuggestion } = useChat()
  const [openSkillId, setOpenSkillId] = useState<string | null>(null)
  const [overlayActive, setOverlayActive] = useState(false)
  const [centerMode, setCenterMode] = useState(false)
  const [heroSplitting, setHeroSplitting] = useState(false)
  const [panelGrow, setPanelGrow] = useState(false)
  const [origin, setOrigin] = useState({ x: '0px', y: '0px' })
  const [connecting, setConnecting] = useState(false)
  const [connectStepIndex, setConnectStepIndex] = useState(0)
  const [initialized, setInitialized] = useState(false)
  const [faqIndex, setFaqIndex] = useState(0)
  const [faqSwap, setFaqSwap] = useState(false)
  const [faqPaused, setFaqPaused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [heroVisible, setHeroVisible] = useState(true)
  const [skillsVisible, setSkillsVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)
  const skillsRef = useRef<HTMLElement | null>(null)
  const skillsPointerFrameRef = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const faqRef = useRef<HTMLButtonElement | null>(null)
  const faqTextRef = useRef<HTMLSpanElement | null>(null)
  const pendingQuestionRef = useRef<string | undefined>(undefined)
  const [faqHeight, setFaqHeight] = useState<number | null>(null)

  const faqItem = faqItems[faqIndex]
  const currentConnectStage = connectStages[Math.min(connectStepIndex, connectStages.length - 1)]
  const skillGridItems = useMemo(() => skillItems, [])

  useLayoutEffect(() => {
    const faqButton = faqRef.current
    const faqText = faqTextRef.current
    if (!faqButton || !faqText) {
      return
    }

    const updateFaqHeight = () => {
      const buttonStyle = getComputedStyle(faqButton)
      const verticalPadding = parseFloat(buttonStyle.paddingTop) + parseFloat(buttonStyle.paddingBottom)
      const verticalBorder = parseFloat(buttonStyle.borderTopWidth) + parseFloat(buttonStyle.borderBottomWidth)
      const minimumHeight = parseFloat(buttonStyle.minHeight) || 0
      const contentHeight = faqText.getBoundingClientRect().height + verticalPadding + verticalBorder
      setFaqHeight(Math.max(minimumHeight, contentHeight))
    }

    updateFaqHeight()
    const observer = new ResizeObserver(updateFaqHeight)
    observer.observe(faqText)
    return () => observer.disconnect()
  }, [faqItem.display])

  useEffect(() => {
    const heroSection = document.querySelector('.hero')
    if (heroSection) {
      const heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setHeroVisible(entry.isIntersecting)
          })
        },
        { threshold: 0.45 }
      )
      heroObserver.observe(heroSection)
      return () => heroObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const skillsSection = document.querySelector('.skills')
    if (!skillsSection) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setSkillsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(skillsSection)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const ctaSection = document.querySelector('.cta')
    if (!ctaSection) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setCtaVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.25 }
    )

    observer.observe(ctaSection)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!connecting) {
      return
    }

    if (connectStepIndex >= connectStages.length) {
      setConnecting(false)
      setInitialized(true)
      if (pendingQuestionRef.current) {
        selectSuggestion(pendingQuestionRef.current)
        pendingQuestionRef.current = undefined
      }
      return
    }

    const duration = connectStepIndex === connectStages.length - 1 ? 420 : 520
    const timeout = window.setTimeout(() => {
      setConnectStepIndex((current) => current + 1)
    }, duration)

    return () => window.clearTimeout(timeout)
  }, [connecting, connectStepIndex, selectSuggestion])

  useEffect(() => {
    if (faqPaused) {
      return
    }

    let swapTimeout: number | undefined
    const interval = window.setInterval(() => {
      setFaqSwap(true)
      swapTimeout = window.setTimeout(() => {
        setFaqIndex((current) => (current + 1) % faqItems.length)
        setFaqSwap(false)
      }, 280)
    }, 2800)

    return () => {
      window.clearInterval(interval)
      if (swapTimeout !== undefined) {
        window.clearTimeout(swapTimeout)
      }
    }
  }, [faqPaused])

  useEffect(() => {
    // guard against document.body being unavailable (embedding/SSR scenarios)
    const body = typeof document !== 'undefined' ? document.body : null
    if (!body || !body.style) {
      return
    }

    if (overlayActive) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = ''
    }

    return () => {
      const currentBody = typeof document !== 'undefined' ? document.body : null
      if (currentBody && currentBody.style) {
        currentBody.style.overflow = ''
      }
    }
  }, [overlayActive])

  const setOriginFromTrigger = (triggerEl?: HTMLElement | null) => {
    if (!triggerEl || !panelRef.current) {
      return
    }

    const triggerRect = triggerEl.getBoundingClientRect()
    const panelRect = panelRef.current.getBoundingClientRect()
    const x = triggerRect.left + triggerRect.width / 2 - (panelRect.left + panelRect.width / 2)
    const y = triggerRect.top + triggerRect.height / 2 - (panelRect.top + panelRect.height / 2)

    setOrigin({ x: `${x}px`, y: `${y}px` })
  }

  const handleSkillsPointerMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (skillsPointerFrameRef.current !== null) {
      cancelAnimationFrame(skillsPointerFrameRef.current)
    }

    skillsPointerFrameRef.current = requestAnimationFrame(() => {
      event.currentTarget.style.setProperty('--skills-ripple-x', `${x}px`)
      event.currentTarget.style.setProperty('--skills-ripple-y', `${y}px`)
      event.currentTarget.style.setProperty('--skills-ripple-active', '1')
    })
  }

  const handleSkillsPointerLeave = (event: React.MouseEvent<HTMLElement>) => {
    if (skillsPointerFrameRef.current !== null) {
      cancelAnimationFrame(skillsPointerFrameRef.current)
      skillsPointerFrameRef.current = null
    }

    event.currentTarget.style.setProperty('--skills-ripple-active', '0')
  }

  const openChat = (question?: string, center = false, triggerEl?: HTMLElement | null) => {
    const shouldCenter = center || triggerEl?.dataset?.center === 'true'
    pendingQuestionRef.current = question
    setOverlayActive(true)
    setPanelGrow(true)
    setCenterMode(shouldCenter)
    setHeroSplitting(shouldCenter)

    if (!initialized && !connecting) {
      setConnecting(true)
      setConnectStepIndex(0)
    }

    if (initialized && question) {
      window.setTimeout(() => selectSuggestion(question), 150)
    }

    requestAnimationFrame(() => setOriginFromTrigger(triggerEl))
  }

  const closeChat = () => {
    setOverlayActive(false)
    setCenterMode(false)
    setHeroSplitting(false)
    setPanelGrow(false)
    setConnecting(false)
    setConnectStepIndex(0)
    pendingQuestionRef.current = undefined
  }

  const handleSkillToggle = (technologyId: string) => {
    setOpenSkillId((current) => (current === technologyId ? null : technologyId))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) {
      return
    }
    sendMessage(trimmed)
    setInputValue('')
  }

  return (
    <>
      <InteractiveNetworkBackground variant="landing" />
      <div className="landing-page">
      <div className="rag-visual" aria-hidden="true" />

      <section className={`hero ${heroVisible ? 'hero-visible' : 'hero-fading'}`}>
        <div className="hero-glow" />
        <div className="hero-name" aria-hidden="true">
          AATHIF NIZAM
        </div>

        <div className={`hero-inner${heroSplitting ? ' splitting' : ''}`} id="heroInner">
          <p className="hero-tag">
            This isn't just my portfolio — it's a live demonstration of
            <br /> how I build AI-powered applications.
          </p>

          <div className="chat-chain">
            <div className="chain-row row-start">
              <span className="dline" />
              <button
                type="button"
                className="bubble bubble-lg bubble-glow"
                data-question="who is aathif? what are his projects"
                data-center="true"
                onClick={(event) => openChat('who is aathif? what are his projects', false, event.currentTarget)}
              >
                Hi! I'm Aathif's AI Assistant
              </button>
            </div>

            <div className="chain-row row-center">
              <button
                type="button"
                className="bubble bubble-cta bubble-glow"
                id="askAnythingBtn"
                data-center="true"
                onClick={(event) => openChat(undefined, true, event.currentTarget)}
              >
                ask me anything
              </button>
              <span className="dline" />
            </div>

            <div className="chain-row row-split chip-row">
              <button
                type="button"
                className="bubble chip chip-faded"
                id="faqChip"
                ref={faqRef}
                style={faqHeight === null ? undefined : { height: `${faqHeight}px` }}
                data-question={faqItem.query}
                onClick={(event) => openChat(faqItem.query, false, event.currentTarget)}
                onMouseEnter={() => setFaqPaused(true)}
                onMouseLeave={() => setFaqPaused(false)}
              >
                <span ref={faqTextRef} className={`faq-text${faqSwap ? ' swap' : ''}`}>{faqItem.display}</span>
              </button>
              <span className="dline" />
              <button
                type="button"
                className="bubble chip"
                id="whoChip"
                data-question="who is aathif? what are his projects"
                onClick={(event) => openChat('who is aathif? what are his projects', false, event.currentTarget)}
              >
                who is aathif? what are his projects
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={skillsRef}
        className={skillsVisible ? 'skills visible' : 'skills'}
        onMouseMove={handleSkillsPointerMove}
        onMouseLeave={handleSkillsPointerLeave}
      >
        <div className="skills-water" aria-hidden="true" />

        <div className="skills-wave-stack" aria-hidden="true">
          <span className="wave wave-one" />
          <span className="wave wave-two" />
          <span className="wave wave-three" />
        </div>

        <div className="skills-orbit" aria-hidden="true">
          <span className="skills-orbit-ball" />
        </div>

        <div className="skills-head">
          <h2>My Skills</h2>
          <p>
            My skills range from graphic design to backend engineering and AI-powered applications — I build the whole stack, not just the demo.
          </p>
        </div>

        <p className="skills-instruction">Click each to see which project I built with it.</p>

        <div className="skills-grid">
          <SkillGrid items={skillGridItems} openSkillId={openSkillId} onToggle={handleSkillToggle} />
        </div>
      </section>

      <section className={`cta ${ctaVisible ? 'cta-visible' : ''}`}>
        <h2>Your next product deserves better AI, better UX, and a better partner.</h2>
        <p className="sub">Let's build it together.</p>
        <div className="contact-row">
          <a href="mailto:aathif.knizam@gmail.com">aathif.knizam@gmail.com</a>
          <a href="https://www.linkedin.com/in/aathif-nizam/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="tel:+919645860618">+91 9645860618</a>
        </div>
      </section>

      <button
        type="button"
        className="chat-launcher"
        onClick={(event) => openChat(undefined, false, event.currentTarget)}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M8 12h8M8 16h5M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className={`chat-overlay${overlayActive ? ' active' : ''}${centerMode ? ' center-mode' : ''}`} aria-hidden={overlayActive ? 'false' : 'true'}>
        <div className={`chat-panel${panelGrow ? ' grow-from-origin' : ''}`} ref={panelRef} style={{ '--origin-x': origin.x, '--origin-y': origin.y } as CSSProperties}>
          <div className="connecting-stage" hidden={!connecting && initialized}>
            <div className="connecting-orb" />
            <p className="connecting-status">{connecting ? currentConnectStage.text : 'Ready.'}</p>
            <div className="connecting-bar">
              <div className="connecting-bar-fill" style={{ width: connecting ? currentConnectStage.width : '100%' }} />
            </div>
          </div>

          <div className="chat-stage" hidden={connecting || !initialized}>
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">A</div>
                <div>
                  <p className="chat-title">AI Assistant</p>
                  <p className="chat-subtitle">Ask anything about the portfolio</p>
                </div>
              </div>
              <button type="button" className="chat-close" onClick={closeChat} aria-label="Close chat">
                ×
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((message, index) => {
                const isUser = message.role === 'user'
                return (
                  <div key={`${message.role}-${index}`} className={`msg ${message.role}`}>
                    {message.projectCards && message.projectCards.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-white/90">{message.text}</p>
                        {message.projectCards.map((project) => (
                          <Link
                            key={project.projectId}
                            to={`/project/${project.projectId}`}
                            className="block rounded-2xl border border-violet-500/20 bg-[#120d1d] p-3 text-left text-sm text-[#f6f1ff] hover:border-violet-400/40"
                          >
                            <p className="font-semibold text-violet-100">{project.projectName}</p>
                            <p className="mt-1 text-xs text-slate-300">{project.shortDescription}</p>
                            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-violet-300">View project →</p>
                          </Link>
                        ))}
                      </div>
                    ) : message.contact ? (
                      <div className="space-y-2">
                        <p className="text-sm text-white/90">{message.text}</p>
                        <a href={`mailto:${message.contact.email}`} className="block text-violet-200 underline underline-offset-2">{message.contact.email}</a>
                        <a href={message.contact.linkedin} target="_blank" rel="noreferrer" className="block text-violet-200 underline underline-offset-2">LinkedIn</a>
                        <a href={`tel:${message.contact.phone.replace(/\s+/g, '')}`} className="block text-violet-200 underline underline-offset-2">{message.contact.phone}</a>
                      </div>
                    ) : (
                      <span>{message.text}</span>
                    )}
                  </div>
                )
              })}
              {error ? (
                <div className="msg bot error">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-300" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-100/90">Offline</span>
                  </div>
                  <p className="mt-2 text-sm text-red-100">{error}</p>
                </div>
              ) : null}
              {isLoading && (
                <div className="msg bot typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
            </div>

            <form className="chat-input-row" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Ask your question..."
                aria-label="Chat message"
              />
              <button type="submit" className="chat-send" disabled={isLoading} aria-label="Send message">
                →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default LandingPage
