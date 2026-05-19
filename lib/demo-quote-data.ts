export type QuoteItem = {
  title: string
  shortDescription: string
  description: string
  bullets: string[]
  price: number
  attachments: { label: string; url: string }[]
  links: string[]
}

export type QuoteData = {
  projectLabel: string
  title: string
  recipientName: string
  summary: string
  preparedBy: string
  validUntil: string
  status: "active" | "draft" | "expired"
  currency: string
  phone: string
  items: QuoteItem[]
  branding: {
    logoPath: string
  }
  actions: {
    approve: boolean
    askQuestion: boolean
    downloadPdf: boolean
  }
}

export function calculateTotal(items: QuoteItem[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

export function formatPrice(price: number, currency: string = "MXN") {
  return `$${price.toLocaleString("es-MX")} ${currency}`
}
