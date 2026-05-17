import { formatPrice } from "@/lib/demo-quote-data"

type QuotePricingProps = {
  total: number
}

export function QuotePricing({ total }: QuotePricingProps) {
  return (
    <div className="mt-6 flex items-center justify-between border border-border-strong rounded-lg px-6 py-4 bg-background-secondary">
      <span className="text-sm font-semibold text-foreground">Inversi&oacute;n total</span>
      <span className="text-xl font-bold text-foreground">{formatPrice(total)}</span>
    </div>
  )
}
