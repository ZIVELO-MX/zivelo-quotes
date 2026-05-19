"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Plus, X, ChevronUp, ChevronDown, Check, DollarSign, Upload, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  title: z.string().min(1, "Requerido"),
  shortDescription: z.string().default(""),
  description: z.string().default(""),
  price: z.coerce.number().min(0, "Debe ser 0 o mayor"),
  bullets: z.array(z.string()).default([]),
})

const formSchema = z.object({
  title: z.string().min(3, "Al menos 3 caracteres"),
  slug: z.string().min(1, "Requerido").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  projectLabel: z.string().default(""),
  recipientName: z.string().min(1, "Requerido"),
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
  items: z.array(itemSchema).min(1, "Al menos un elemento es requerido"),
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

export function QuoteCreateForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [logoMode, setLogoMode] = useState<"default" | "upload">("default")

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

  const { fields, append, remove, swap } = useFieldArray({
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

  function BulletEditor({ index }: { index: number }) {
    const [input, setInput] = useState("")
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editValue, setEditValue] = useState("")
    const bullets = useWatch({ control: form.control, name: `items.${index}.bullets` }) ?? []
    const editRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (editingIndex !== null && editRef.current) {
        editRef.current.focus()
        editRef.current.select()
      }
    }, [editingIndex])

    function addBullet() {
      const trimmed = input.trim()
      if (!trimmed) return
      form.setValue(`items.${index}.bullets`, [...bullets, trimmed])
      setInput("")
    }

    function removeBullet(i: number) {
      form.setValue(`items.${index}.bullets`, bullets.filter((_: string, j: number) => j !== i))
    }

    function startEdit(i: number) {
      setEditingIndex(i)
      setEditValue(bullets[i])
    }

    function saveEdit(i: number) {
      const trimmed = editValue.trim()
      if (!trimmed) {
        removeBullet(i)
      } else {
        const next = [...bullets]
        next[i] = trimmed
        form.setValue(`items.${index}.bullets`, next)
      }
      setEditingIndex(null)
    }

    function cancelEdit() {
      setEditingIndex(null)
    }

    function moveBullet(i: number, dir: -1 | 1) {
      const j = i + dir
      if (j < 0 || j >= bullets.length) return
      const next = [...bullets]
      ;[next[i], next[j]] = [next[j], next[i]]
      form.setValue(`items.${index}.bullets`, next)
    }

    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBullet() } }}
            placeholder="Escribe un punto clave"
            className="h-9 flex-1 min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          />
        </div>
        {bullets.length > 0 && (
          <ul className="space-y-1.5">
            {bullets.map((b: string, i: number) => (
              <li key={i} className="flex items-center gap-2 rounded-md border border-border bg-background-secondary/50 px-3 py-2 text-sm">
                <div className="flex flex-col gap-px shrink-0">
                  <button
                    type="button"
                    onClick={() => moveBullet(i, -1)}
                    disabled={i === 0}
                    className="text-foreground-dim hover:text-foreground transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed leading-none"
                    aria-label="Mover arriba"
                  >
                    <ChevronUp className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBullet(i, 1)}
                    disabled={i === bullets.length - 1}
                    className="text-foreground-dim hover:text-foreground transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed leading-none"
                    aria-label="Mover abajo"
                  >
                    <ChevronDown className="size-3" />
                  </button>
                </div>
                <span className="block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/70" />
                {editingIndex === i ? (
                  <input
                    ref={editRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); saveEdit(i) }
                      if (e.key === "Escape") { cancelEdit() }
                    }}
                    onBlur={() => saveEdit(i)}
                    className="flex-1 min-w-0 rounded-md border border-input bg-transparent px-2 py-0.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  />
                ) : (
                  <span
                    className="flex-1 text-foreground-muted cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => startEdit(i)}
                  >
                    {b}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeBullet(i)}
                  className="text-foreground-dim hover:text-accent transition-colors cursor-pointer shrink-0"
                  aria-label="Eliminar punto"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-foreground-dim">Presiona Enter para agregar un punto clave</p>
      </div>
    )
  }

  function StatusDropdown({ value, onChange }: { value: string; onChange: (v: "draft" | "active") => void }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const options = [
      { value: "draft", label: "Borrador", color: "bg-amber-500" },
      { value: "active", label: "Activa", color: "bg-green-500" },
    ] as const
    const current = options.find((o) => o.value === value)!

    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 text-foreground-muted border border-border hover:text-foreground hover:bg-black/4 hover:border-border-strong hover:shadow-sm w-full"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={`block h-2 w-2 rounded-full ${current.color}`} />
          {current.label}
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className="ml-auto transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
        <div
          className={[
            "absolute top-full left-0 mt-2 rounded-xl overflow-hidden z-50 min-w-[180px] bg-white/92 backdrop-blur-md border border-border/80 shadow-lg transition-all duration-200 ease-in-out",
            open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none",
          ].join(" ")}
          role="listbox"
        >
            {options.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={[
                  "w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 text-left",
                  value === opt.value ? "text-foreground" : "text-foreground-muted",
                  i > 0 ? "border-t border-border/60" : "",
                ].join(" ")}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span className="flex items-center gap-2">
                  <span className={`block h-2 w-2 rounded-full ${opt.color}`} />
                  {opt.label}
                </span>
                {value === opt.value && (
                  <Check size={16} strokeWidth={2} className="text-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
    )
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
        toast.success("Cotización creada")
        router.push(`/q/${result.slug}`)
      } else {
        toast.error(result.error ?? "Error al crear la cotización")
      }
    } catch {
      toast.error("Ocurrió un error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
          <CardDescription>
            Los datos principales de tu propuesta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Título *</Label>
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
              <Label htmlFor="projectLabel">Etiqueta del proyecto</Label>
              <Input
                id="projectLabel"
                placeholder="Propuesta · Proyecto Web"
                {...form.register("projectLabel")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientName">Cliente *</Label>
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
              <Label htmlFor="preparedBy">Preparado por</Label>
              <Input
                id="preparedBy"
                {...form.register("preparedBy")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Resumen</Label>
            <Textarea
              id="summary"
              placeholder="Describe la propuesta en unas líneas..."
              className="min-h-24"
              {...form.register("summary")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuración */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>
            Estado, moneda y datos de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Estado</Label>
              <StatusDropdown
                value={form.watch("status")}
                onChange={(v) => form.setValue("status", v)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Input
                id="currency"
                placeholder="MXN"
                {...form.register("currency")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">
                Válido hasta <span className="text-foreground-dim font-normal">(opcional)</span>
              </Label>
              <Input
                id="validUntil"
                placeholder="30 Jun 2026"
                {...form.register("validUntil")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                placeholder="+5213921107274"
                {...form.register("phone")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elementos */}
      <Card>
        <CardHeader>
          <CardTitle>Elementos</CardTitle>
          <CardDescription>
            Los servicios o entregables incluidos en esta propuesta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground-muted">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => index > 0 && swap(index, index - 1)}
                      disabled={index === 0}
                      className="text-foreground-dim hover:text-foreground transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      aria-label="Mover arriba"
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => index < fields.length - 1 && swap(index, index + 1)}
                      disabled={index === fields.length - 1}
                      className="text-foreground-dim hover:text-foreground transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      aria-label="Mover abajo"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                  </div>
                  Elemento {index + 1}
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
                  <Label htmlFor={`items.${index}.title`}>Título *</Label>
                  <Input
                    id={`items.${index}.title`}
                    placeholder="Dirección de marca"
                    {...form.register(`items.${index}.title`)}
                  />
                  {form.formState.errors.items?.[index]?.title && (
                    <p className="text-xs text-accent">Requerido</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.shortDescription`}>
                    Descripción corta
                  </Label>
                  <Input
                    id={`items.${index}.shortDescription`}
                    placeholder="Bases visuales y lineamientos de estilo"
                    {...form.register(`items.${index}.shortDescription`)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={`items.${index}.description`}>
                    Descripción completa
                  </Label>
                  <Textarea
                    id={`items.${index}.description`}
                    placeholder="Describe el entregable en detalle..."
                    className="min-h-20"
                    {...form.register(`items.${index}.description`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.price`}>Precio</Label>
                  <div className="relative">
                    <DollarSign
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-dim pointer-events-none"
                    />
                    <Input
                      id={`items.${index}.price`}
                      type="number"
                      min={0}
                      placeholder="4800"
                      className="pl-8"
                      {...form.register(`items.${index}.price`)}
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Puntos clave</Label>
                  <BulletEditor index={index} />
                </div>
              </div>
            </div>
          ))}
          {form.formState.errors.items && !Array.isArray(form.formState.errors.items) && (
            <p className="text-xs text-accent">
              {form.formState.errors.items.message}
            </p>
          )}
          <button
            type="button"
            onClick={() =>
              append({
                title: "",
                shortDescription: "",
                description: "",
                price: 0,
                bullets: [],
              })
            }
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 text-foreground-muted border border-border hover:text-foreground hover:bg-black/4 hover:border-border-strong hover:shadow-sm cursor-pointer"
          >
            <Plus size={16} strokeWidth={1.5} />
            Agregar elemento
          </button>
        </CardContent>
      </Card>

      {/* Marca y acciones */}
      <Card>
        <CardHeader>
          <CardTitle>Marca y acciones</CardTitle>
          <CardDescription>
            Identidad visual y botones disponibles para esta cotización
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="relative flex gap-1 rounded-xl border border-border bg-background-secondary/30 p-1 text-sm font-medium">
              <div
                className={[
                  "absolute left-1 top-1 bottom-1 w-[calc(50%-0.125rem)] rounded-lg bg-white shadow-xs transition-transform duration-200 ease-in-out",
                  logoMode === "upload" ? "translate-x-[calc(100%+0.25rem)]" : "translate-x-0",
                ].join(" ")}
              />
              <button
                type="button"
                onClick={() => { form.setValue("branding.logoPath", "public/logos/zivelo-bars-dark-full.svg"); setLogoMode("default") }}
                className={[
                  "relative flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-150 flex-1 justify-center z-10",
                  logoMode === "default" ? "text-foreground" : "text-foreground-muted hover:text-foreground",
                ].join(" ")}
              >
                <ImageIcon size={16} strokeWidth={1.5} />
                Logo empresarial
              </button>
              <button
                type="button"
                onClick={() => setLogoMode("upload")}
                className={[
                  "relative flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-150 flex-1 justify-center z-10",
                  logoMode === "upload" ? "text-foreground" : "text-foreground-muted hover:text-foreground",
                ].join(" ")}
              >
                <Upload size={16} strokeWidth={1.5} />
                Subir logo
              </button>
            </div>
            {logoMode === "upload" ? (
              <div className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background-secondary/20 px-6 py-8 text-center transition-colors hover:border-border-strong hover:bg-black/4">
                <Upload size={24} strokeWidth={1.5} className="text-foreground-dim" />
                <div>
                  <p className="text-sm font-medium text-foreground-muted">
                    Sube tu logo aquí
                  </p>
                  <p className="text-xs text-foreground-dim mt-0.5">
                    SVG o PNG · Se reemplazará el logo por defecto
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-4 rounded-xl border border-border bg-background-secondary/20 px-5 py-4">
                <div className="flex h-14 w-28 shrink-0 items-center justify-center rounded-lg border border-border bg-white px-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logos/zivelo-bars-dark-full.svg"
                    alt="Logo Zivelo"
                    className="max-h-10 max-w-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Logotipo de Zivelo</p>
                  <p className="text-xs text-foreground-dim mt-0.5">
                    Se usará como imagen de marca en la cotización
                  </p>
                </div>
              </div>
            )}
          </div>
          <Separator />
          <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
            Acciones disponibles
          </p>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <Switch
                checked={form.watch("actions.approve")}
                onCheckedChange={(v) => form.setValue("actions.approve", v)}
                className="data-[state=checked]:bg-accent!"
              />
              <span className="text-sm">Aprobar</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Switch
                checked={form.watch("actions.askQuestion")}
                onCheckedChange={(v) => form.setValue("actions.askQuestion", v)}
                className="data-[state=checked]:bg-accent!"
              />
              <span className="text-sm">Hacer pregunta</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Switch
                checked={form.watch("actions.downloadPdf")}
                onCheckedChange={(v) => form.setValue("actions.downloadPdf", v)}
                className="data-[state=checked]:bg-accent!"
              />
              <span className="text-sm">Descargar PDF</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 pb-12">
        <Button
          type="button"
          variant="outline"
          className="text-foreground border-border hover:bg-background-secondary shadow-none"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-accent hover:bg-accent-hover text-white"
        >
          {submitting ? "Creando…" : "Crear cotización"}
        </Button>
      </div>
    </form>
  )
}
