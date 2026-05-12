import { Globe, Palette, Server, Lock } from "lucide-react"

const ROADMAP = [
  { icon: Globe, label: "Custom domains", desc: "quotes.yourbrand.com" },
  { icon: Palette, label: "Client branding", desc: "Full white-label visual identity" },
  { icon: Server, label: "Dedicated deployments", desc: "Isolated infrastructure per client" },
  { icon: Lock, label: "Private quote views", desc: "Password or email-gated proposals" },
]

export function FutureSection() {
  return (
    <section
      id="roadmap"
      className="py-24 px-5 border-t border-border"
      aria-labelledby="future-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Text */}
            <div className="p-10 lg:p-12 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                Roadmap
              </p>
              <h2
                id="future-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance"
              >
                Built to scale with your business.
              </h2>
              <p className="mt-4 text-base text-foreground-muted leading-relaxed text-pretty">
                Zivelo Quotes starts as an internal tool and evolves into a platform
                that supports white-label clients, custom domains, and enterprise-grade deployments.
              </p>
            </div>

            {/* Roadmap items */}
            <div className="bg-background-secondary border-t md:border-t-0 md:border-l border-border p-10 lg:p-12 grid grid-cols-2 gap-8">
              {ROADMAP.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex flex-col gap-2.5">
                  <div className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-foreground-muted">
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-foreground-muted mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
