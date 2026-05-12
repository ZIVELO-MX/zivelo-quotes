import { Sparkles, Layers, BarChart2 } from "lucide-react"

const PILLARS = [
  {
    icon: Sparkles,
    title: "Fully branded proposal pages",
    body: "Every quote is a beautiful web page — your logo, your colors, your story. Clients receive a link, not an attachment.",
  },
  {
    icon: Layers,
    title: "Visual, structured content",
    body: "Line items, pricing tables, timelines, and context — all presented in a scannable, modern layout.",
  },
  {
    icon: BarChart2,
    title: "Insights & engagement",
    body: "Know when clients open your quote, which sections they dwell on, and what questions they leave.",
  },
]

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="py-24 px-5 border-t border-border"
      aria-labelledby="solution-heading"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          How it works
        </p>
        <h2
          id="solution-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance max-w-xl"
        >
          Proposals that are a pleasure to receive.
        </h2>
        <p className="mt-4 text-base text-foreground-muted leading-relaxed max-w-lg text-pretty">
          Zivelo Quotes transforms a spreadsheet into an interactive proposal page
          that&apos;s shareable via link, optimised for mobile, and impossible to ignore.
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-8">
          {PILLARS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold text-foreground-dim tabular-nums w-5">
                  0{i + 1}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="w-9 h-9 rounded-lg border border-border bg-background-secondary flex items-center justify-center text-foreground-muted">
                <Icon size={16} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
