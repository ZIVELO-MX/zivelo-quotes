"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Plus, X, GripVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"


const itemSchema = z.object({
  title: z.string().min(1, "Required"),
  shortDescription: z.string().default(""),
  description: z.string().default(""),
  price: z.coerce.number().min(0, "Must be 0 or greater"),
  bullets: z.array(z.string()).default([]),
})

const formSchema = z.object({
  title: z.string().min(3, "At least 3 characters"),
  slug: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  projectLabel: z.string().default(""),
  recipientName: z.string().min(1, "Required"),
  summary: z.string().default(""),
  preparedBy: z.string().default("Zivelo"),
  validUntil: z.string().default(""),
  status: z.enum(["draft", "active"]).default("draft"),
  currency: z.string().default("MXN"),
  phone: z.string().default(""),
  branding: z.object({
    logoPath: z.string().default(""),
  }).default({ logoPath: "" }),
  actions: z.object({
    approve: z.boolean().default(true),
    askQuestion: z.boolean().default(true),
    downloadPdf: z.boolean().default(true),
  }).default({ approve: true, askQuestion: true, downloadPdf: true }),
  items: z.array(itemSchema).min(1, "At least one item is required"),
})

type FormValues = z.infer<typeof formSchema>

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const [input, setInput] = useState("")

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag, i) => (
          <Badge key={i} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="ml-0.5 rounded-sm hover:text-foreground cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        placeholder={placeholder ?? "Type and press Enter"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            const trimmed = input.trim()
            if (trimmed && !value.includes(trimmed)) {
              onChange([...value, trimmed])
            }
            setInput("")
          }
        }}
      />
    </div>
  )
}

export function QuoteCreateForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      projectLabel: "",
      recipientName: "",
      summary: "",
      preparedBy: "Zivelo",
      validUntil: "",
      status: "draft",
      currency: "MXN",
      phone: "",
      branding: { logoPath: "" },
      actions: { approve: true, askQuestion: true, downloadPdf: true },
      items: [
        {
          title: "",
          shortDescription: "",
          description: "",
          price: 0,
          bullets: [],
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const watchTitle = form.watch("title")

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    form.setValue("title", value)
    const currentSlug = form.getValues("slug")
    if (!currentSlug || currentSlug === slugify(form.formState.defaultValues?.title ?? "")) {
      form.setValue("slug", slugify(value))
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    try {
      const { createQuote } = await import("@/lib/actions/quote")
      const payload = {
        slug: values.slug,
        projectLabel: values.projectLabel,
        title: values.title,
        recipientName: values.recipientName,
        summary: values.summary,
        preparedBy: values.preparedBy,
        validUntil: values.validUntil,
        status: values.status,
        currency: values.currency,
        phone: values.phone,
        branding: values.branding,
        items: values.items,
        actions: values.actions,
      }
      const result = await createQuote(payload)
      if (result.success) {
        toast.success("Quote created")
        router.push(`/q/${result.slug}`)
      } else {
        toast.error(result.error ?? "Failed to create quote")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            The core details of your proposal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="ACME Corp — Propuesta de Sitio Web"
                value={watchTitle}
                onChange={handleTitleChange}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-accent">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                placeholder="acme-corp-sitio-web"
                {...form.register("slug")}
              />
              {form.formState.errors.slug && (
                <p className="text-xs text-accent">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectLabel">Project Label</Label>
              <Input
                id="projectLabel"
                placeholder="Propuesta · Proyecto Web"
                {...form.register("projectLabel")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                placeholder="ACME Corp"
                {...form.register("recipientName")}
              />
              {form.formState.errors.recipientName && (
                <p className="text-xs text-accent">
                  {form.formState.errors.recipientName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preparedBy">Prepared By</Label>
              <Input
                id="preparedBy"
                {...form.register("preparedBy")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              placeholder="Describe the proposal in a few sentences..."
              className="min-h-24"
              {...form.register("summary")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Status, pricing, and contact settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) => form.setValue("status", v as "draft" | "active")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                placeholder="MXN"
                {...form.register("currency")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                placeholder="30 Jun 2026"
                {...form.register("validUntil")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+5213921107274"
                {...form.register("phone")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>
            The services or deliverables included in this proposal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground-muted">
                  <GripVertical className="size-4" />
                  Item {index + 1}
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-foreground-dim hover:text-accent transition-colors cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.title`}>Title *</Label>
                  <Input
                    id={`items.${index}.title`}
                    placeholder="Dirección de marca"
                    {...form.register(`items.${index}.title`)}
                  />
                  {form.formState.errors.items?.[index]?.title && (
                    <p className="text-xs text-accent">Required</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.shortDescription`}>
                    Short Description
                  </Label>
                  <Input
                    id={`items.${index}.shortDescription`}
                    placeholder="Bases visuales y lineamientos de estilo"
                    {...form.register(`items.${index}.shortDescription`)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={`items.${index}.description`}>
                    Full Description
                  </Label>
                  <Textarea
                    id={`items.${index}.description`}
                    placeholder="Describe the deliverable in detail..."
                    className="min-h-20"
                    {...form.register(`items.${index}.description`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.price`}>Price</Label>
                  <Input
                    id={`items.${index}.price`}
                    type="number"
                    min={0}
                    placeholder="4800"
                    {...form.register(`items.${index}.price`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bullet Points</Label>
                  <TagInput
                    value={form.watch(`items.${index}.bullets`)}
                    onChange={(v) => form.setValue(`items.${index}.bullets`, v)}
                    placeholder="Add a bullet point"
                  />
                </div>
              </div>
            </div>
          ))}
          {form.formState.errors.items && !Array.isArray(form.formState.errors.items) && (
            <p className="text-xs text-accent">
              {form.formState.errors.items.message}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                title: "",
                shortDescription: "",
                description: "",
                price: 0,
                bullets: [],
              })
            }
          >
            <Plus className="size-4" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Branding & Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Branding & Actions</CardTitle>
          <CardDescription>
            Visual identity and available actions for this quote
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="logoPath">Logo Path</Label>
            <Input
              id="logoPath"
              placeholder="public/logos/zivelo-bars-dark-full.svg"
              {...form.register("branding.logoPath")}
            />
          </div>
          <Separator />
          <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
            Available Actions
          </p>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <Switch
                checked={form.watch("actions.approve")}
                onCheckedChange={(v) => form.setValue("actions.approve", v)}
              />
              <span className="text-sm">Approve</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Switch
                checked={form.watch("actions.askQuestion")}
                onCheckedChange={(v) => form.setValue("actions.askQuestion", v)}
              />
              <span className="text-sm">Ask Question</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Switch
                checked={form.watch("actions.downloadPdf")}
                onCheckedChange={(v) => form.setValue("actions.downloadPdf", v)}
              />
              <span className="text-sm">Download PDF</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 pb-12">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Create Quote"}
        </Button>
      </div>
    </form>
  )
}
