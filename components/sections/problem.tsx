import { FileX, Clock, Frown } from "lucide-react"

const PAINS = [
  {
    icon: FileX,
    title: "Static PDFs nobody reads",
    body: "Attachments get lost, aren't mobile-friendly, and give you zero signal on whether the client even opened them.",
  },
  {
    icon: Clock,
    title: "Generic templates, zero personality",
    body: "Every proposal looks the same. Clients can't tell you apart from your competition.",
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
      id="problem"
      className="py-24 px-5 border-t border-border bg-background-secondary"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          The problem
        </p>
        <h2
          id="problem-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance max-w-xl"
        >
          Traditional quotes feel like a 2005 Word doc.
        </h2>
        <p className="mt-4 text-base text-foreground-muted leading-relaxed max-w-lg text-pretty">
          The way most agencies share proposals hasn&apos;t changed in decades.
          Your clients&apos; expectations have.
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-px bg-border">
          {PAINS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-background-secondary p-8 flex flex-col gap-4"
            >
              <div className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center text-foreground-muted flex-shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
