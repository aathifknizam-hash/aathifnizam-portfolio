import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-slate-950/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link to="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90 transition hover:text-white">
          Aathif
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm text-slate-200 transition hover:text-white">
            Home
          </Link>
          <Link to="/project/clinic-management-system" className="text-sm text-slate-200 transition hover:text-white">
            Projects
          </Link>
          <Link to="/technology/react" className="text-sm text-slate-200 transition hover:text-white">
            Technologies
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
