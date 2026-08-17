import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-10 text-center shadow-soft">
      <p className="text-sm uppercase tracking-[0.3em] text-brand">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-100">Page not found</h1>
      <p className="mt-4 text-slate-400">The link you followed may be broken, or the page may have moved.</p>
      <Link className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#c8b4ff]/20 bg-[#120d1d]/80 px-4 py-3 text-sm font-medium text-[#d6c9ff] transition hover:border-[#b592ff] hover:bg-[#1a1527]/80" to="/">
        ← Back to home
      </Link>
    </div>
  )
}

export default NotFoundPage
