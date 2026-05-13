import { Eye, Layout, Sparkles, Share2 } from "lucide-react"

const REASONS = [
  {
    icon: Eye,
    number: "01",
    title: "Present ideas visually",
    body: "Show services, pricing, timelines, examples, and deliverables in a way clients can actually explore and understand.",
  },
  {
    icon: Layout,
    number: "02",
    title: "Make proposals easier to navigate",
    body: "Instead of overwhelming documents, organize information into clean visual sections that guide the client naturally through the proposal.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Create a stronger first impression",
    body: "Every proposal feels polished, modern, and professional from the very first click.",
  },
  {
    icon: Share2,
    number: "04",
    title: "Share proposals with confidence",
    body: "Send a simple link instead of large files or messy message threads. Every proposal is designed to look clean and presentable when shared.",
  },
]

export function SolutionSection() {
  return (
    <section
      id="why"
      className="py-24 px-5 border-t border-border"
      aria-labelledby="why-heading"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          The solution
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h2
            id="why-heading"
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance max-w-xl"
          >
            Why it feels different
          </h2>
          <p className="text-sm text-foreground-muted max-w-xs text-pretty shrink-0">
            Four reasons clients respond better to Zivelo proposals.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 gap-px bg-border">
          {REASONS.map(({ icon: Icon, number, title, body }) => (
            <div
              key={title}
              className="bg-background group p-8 flex flex-col gap-6 transition-colors duration-200 hover:bg-background-secondary"
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-4xl font-bold tracking-tight leading-none"
                  style={{ color: "#e9e9e7" }}
                >
                  {number}
                </span>
                <div className="w-9 h-9 rounded-lg border border-border bg-background-secondary group-hover:bg-white flex items-center justify-center text-foreground-muted transition-colors duration-200">
                  <Icon size={16} strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-foreground leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
