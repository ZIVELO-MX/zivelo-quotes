import {
  MousePointerClick,
  Link2,
  FileDown,
  Image as ImageIcon,
  LayoutDashboard,
  Globe,
} from "lucide-react"

const FEATURES = [
  {
    icon: MousePointerClick,
    title: "Interactive quote pages",
    body: "Clients navigate structured sections — overview, deliverables, pricing, timeline — in a single beautiful page.",
  },
  {
    icon: Link2,
    title: "Public shareable links",
    body: "Share a clean URL with any client, no login required. Works perfectly on mobile.",
  },
  {
    icon: FileDown,
    title: "PDF export",
    body: "Generate a clean PDF version on demand for clients who need a document for their records.",
  },
  {
    icon: ImageIcon,
    title: "Custom Open Graph previews",
    body: "Every quote generates a branded social card with your client name and project title.",
  },
  {
    icon: LayoutDashboard,
    title: "Internal dashboard",
    body: "Manage all your quotes, track status, and monitor engagement from one place.",
  },
  {
    icon: Globe,
    title: "White-label support (coming soon)",
    body: "Custom domains and full client branding for agencies and resellers.",
  },
]

export function FeaturesSection() {
  return (
    <section
      className="py-28 px-6 bg-background-secondary"
      aria-labelledby="features-heading"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
          Features
        </p>
        <h2
          id="features-heading"
          className="font-display text-3xl sm:text-4xl font-bold text-foreground text-balance max-w-xl"
        >
          Everything a modern proposal needs.
        </h2>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3 group hover:border-accent/30 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent/15 transition-colors duration-200">
                <Icon size={18} />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
