import { Sparkles, Layers, BarChart2 } from "lucide-react"

const PILLARS = [
  {
    icon: Sparkles,
    title: "Branded proposal pages",
    body: "Every quote is a fully branded web page — your logo, your colors, your story. Not a generic template.",
  },
  {
    icon: Layers,
    title: "Visual, structured content",
    body: "Line items, pricing tables, timelines, and context — all presented in a scannable, beautiful layout.",
  },
  {
    icon: BarChart2,
    title: "Insights & engagement tracking",
    body: "Know when clients open your quote, which sections they dwell on, and what questions they have.",
  },
]

export function SolutionSection() {
  return (
    <section
      className="py-28 px-6"
      aria-labelledby="solution-heading"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
          The solution
        </p>
        <h2
          id="solution-heading"
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance max-w-2xl"
        >
          Proposals that are a pleasure to receive.
        </h2>
        <p className="mt-5 text-lg text-foreground-muted leading-relaxed max-w-xl text-pretty">
          Zivelo Quotes transforms a spreadsheet into an interactive proposal page
          that&apos;s shareable via link, optimised for mobile, and impossible to ignore.
        </p>

        {/* Pillars */}
        <div className="mt-14 grid sm:grid-cols-3 gap-8">
          {PILLARS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-accent/50 font-display tabular-nums">
                  0{i + 1}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Icon size={20} />
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
