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
    body: "Clients navigate structured sections — overview, deliverables, pricing, timeline — all in one beautiful page.",
  },
  {
    icon: Link2,
    title: "Public shareable links",
    body: "Share a clean URL with any client. No login required. Works perfectly on mobile.",
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
    title: "White-label support",
    body: "Custom domains and full client branding for agencies and resellers. Coming soon.",
    soon: true,
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 px-5 border-t border-border bg-background-secondary"
      aria-labelledby="features-heading"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          Features
        </p>
        <h2
          id="features-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance max-w-xl"
        >
          Everything a modern proposal needs.
        </h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {FEATURES.map(({ icon: Icon, title, body, soon }) => (
            <div
              key={title}
              className="bg-background-secondary p-7 flex flex-col gap-3"
            >
              <div className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center text-foreground-muted flex-shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  {soon && (
                    <span className="text-[10px] font-medium text-foreground-dim border border-border rounded-full px-2 py-0.5">
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
