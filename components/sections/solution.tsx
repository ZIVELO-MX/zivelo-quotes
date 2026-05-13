import { Eye, Layout, Sparkles, Share2 } from "lucide-react"

const REASONS = [
  {
    icon: Eye,
    title: "Present ideas visually",
    body: "Show services, pricing, timelines, examples, and deliverables in a way clients can actually explore and understand.",
  },
  {
    icon: Layout,
    title: "Make proposals easier to navigate",
    body: "Instead of overwhelming documents, organize information into clean visual sections that guide the client naturally through the proposal.",
  },
  {
    icon: Sparkles,
    title: "Create a stronger first impression",
    body: "Every proposal feels polished, modern, and professional from the very first click.",
  },
  {
    icon: Share2,
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
        <h2
          id="why-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance max-w-xl"
        >
          Why it feels different
        </h2>

        <div className="mt-16 grid gap-12 md:gap-16">
          {REASONS.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className={[
                "grid md:grid-cols-[1fr_2fr] gap-6 md:gap-12 items-start",
                i < REASONS.length - 1 ? "pb-12 md:pb-16 border-b border-border" : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-border bg-background-secondary flex items-center justify-center text-foreground-muted">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              </div>
              <p className="text-base text-foreground-muted leading-relaxed md:pt-2">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
