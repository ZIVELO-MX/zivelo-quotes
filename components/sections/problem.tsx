import { FileX, Clock, Frown } from "lucide-react"

const PAINS = [
  {
    icon: FileX,
    title: "Static PDFs that nobody reads",
    body: "Attachments get lost, aren't mobile-friendly, and give you zero signal on whether the client even opened them.",
  },
  {
    icon: Clock,
    title: "Generic templates in 10 seconds",
    body: "Every proposal looks the same. No branding, no personality — clients can't tell the difference between you and your competitors.",
  },
  {
    icon: Frown,
    title: "Hard to present out loud",
    body: "Walking a client through a PDF live is awkward. Scrolling through pages of text is not a great closing pitch.",
  },
]

export function ProblemSection() {
  return (
    <section
      className="py-28 px-6 bg-background-secondary"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
          The problem
        </p>
        <h2
          id="problem-heading"
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance max-w-2xl"
        >
          Traditional quotes feel like a 2005 Word document.
        </h2>
        <p className="mt-5 text-lg text-foreground-muted leading-relaxed max-w-xl text-pretty">
          The way most agencies and teams share proposals hasn&apos;t changed in decades.
          The tools have — clients&apos; expectations have too.
        </p>

        {/* Pain cards */}
        <div className="mt-14 grid sm:grid-cols-3 gap-6">
          {PAINS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
