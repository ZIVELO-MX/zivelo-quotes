"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray, useWatch, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus, X, ChevronUp, ChevronDown, Check, DollarSign, Upload, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { formSchema, type FormValues } from "@/lib/schemas/quote"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function BulletEditor({ index }: { index: number }) {
  const { setValue } = useFormContext()
  const [input, setInput] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const bullets = useWatch({ name: `items.${index}.bullets` }) ?? []
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
    setValue(`items.${index}.bullets`, [...bullets, trimmed])
    setInput("")
  }

  function removeBullet(i: number) {
    setValue(`items.${index}.bullets`, bullets.filter((_: string, j: number) => j !== i))
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
      setValue(`items.${index}.bullets`, next)
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
    setValue(`items.${index}.bullets`, next)
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

const currencies = [
  { value: "MXN", label: "MXN", flag: "🇲🇽", name: "Peso mexicano" },
  { value: "USD", label: "USD", flag: "🇺🇸", name: "Dólar estadounidense" },
  { value: "EUR", label: "EUR", flag: "🇪🇺", name: "Euro" },
  { value: "COP", label: "COP", flag: "🇨🇴", name: "Peso colombiano" },
  { value: "CLP", label: "CLP", flag: "🇨🇱", name: "Peso chileno" },
  { value: "ARS", label: "ARS", flag: "🇦🇷", name: "Peso argentino" },
  { value: "BRL", label: "BRL", flag: "🇧🇷", name: "Real brasileño" },
] as const

function CurrencyDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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

  const current = currencies.find((c) => c.value === value)!

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 text-foreground-muted border border-border hover:text-foreground hover:bg-black/4 hover:border-border-strong hover:shadow-sm w-full"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{current.flag}</span>
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
          "absolute top-full left-0 mt-2 rounded-xl overflow-hidden z-50 min-w-[220px] bg-white/92 backdrop-blur-md border border-border/80 shadow-lg transition-all duration-200 ease-in-out",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none",
        ].join(" ")}
        role="listbox"
      >
          {currencies.map((opt, i) => (
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
                <span className="text-base leading-none">{opt.flag}</span>
                <span>{opt.label}</span>
                <span className="text-foreground-dim font-normal text-xs">{opt.name}</span>
              </span>
              {value === opt.value && (
                <Check size={16} strokeWidth={2} className="text-accent shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
  )
}

interface QuoteFormProps {
  mode?: "create" | "edit"
  initialData?: FormValues
}

export function QuoteForm({ mode = "create", initialData }: QuoteFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const [submitting, setSubmitting] = useState(false)
  const [logoMode, setLogoMode] = useState<"default" | "upload">(
    initialData?.branding?.logoPath &&
      initialData.branding.logoPath !== "public/logos/zivelo-bars-dark-full.svg"
      ? "upload"
      : "default",
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {
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

  function handleTitleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) {
    const value = e.target.value
    fieldOnChange(e)
    if (isEdit) return
    const currentSlug = form.getValues("slug")
    if (!currentSlug || currentSlug === slugify(form.formState.defaultValues?.title ?? "")) {
      form.setValue("slug", slugify(value))
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    try {
      const { createQuote, updateQuote } = await import("@/lib/actions/quote")
      const result = isEdit
        ? await updateQuote(initialData!.slug, values)
        : await createQuote(values)
      if (result.success) {
        toast.success(isEdit ? "Cotización actualizada" : "Cotización creada")
        router.push(`/dashboard/quotes`)
      } else {
        toast.error(result.error ?? "Error al guardar la cotización")
      }
    } catch {
      toast.error("Ocurrió un error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
            <CardDescription>
              Los datos principales de tu propuesta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ACME Corp — Propuesta de Sitio Web"
                        {...field}
                        onChange={(e) => handleTitleChange(e, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="acme-corp-sitio-web"
                        {...field}
                        disabled={isEdit}
                        className={isEdit ? "text-gray-400 bg-gray-50 cursor-not-allowed" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiqueta del proyecto</FormLabel>
                    <FormControl>
                      <Input placeholder="Propuesta · Proyecto Web" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente *</FormLabel>
                    <FormControl>
                      <Input placeholder="ACME Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preparedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparado por</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe la propuesta en unas líneas..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
            <CardDescription>
              Estado, moneda y datos de contacto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <StatusDropdown value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <FormControl>
                      <CurrencyDropdown value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Válido hasta <span className="text-foreground-dim font-normal">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="30 Jun 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+5213921107274" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Elementos</CardTitle>
            <CardDescription>
              Los servicios o entregables incluidos en esta propuesta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((itemField, index) => (
              <div key={itemField.id}>
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
                  <FormField
                    control={form.control}
                    name={`items.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input placeholder="Dirección de marca" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.shortDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción corta</FormLabel>
                        <FormControl>
                          <Input placeholder="Bases visuales y lineamientos de estilo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Descripción completa</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe el entregable en detalle..."
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign
                              size={16}
                              strokeWidth={1.5}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-dim pointer-events-none"
                            />
                            <Input
                              type="number"
                              min={0}
                              placeholder="4800"
                              className="pl-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.bullets`}
                    render={() => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Puntos clave</FormLabel>
                        <BulletEditor index={index} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            {form.formState.errors.items && !Array.isArray(form.formState.errors.items) && (
              <p className="text-xs text-destructive">
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

        <Card>
          <CardHeader>
            <CardTitle>Marca y acciones</CardTitle>
            <CardDescription>
              Identidad visual y botones disponibles para esta cotización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="branding.logoPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="relative flex gap-1 rounded-xl border border-border bg-background-secondary/30 p-1 text-sm font-medium">
                        <div
                          className={[
                            "absolute left-1 top-1 bottom-1 w-[calc(50%-0.125rem)] rounded-lg bg-white shadow-xs transition-transform duration-200 ease-in-out",
                            logoMode === "upload" ? "translate-x-[calc(100%+0.25rem)]" : "translate-x-0",
                          ].join(" ")}
                        />
                        <button
                          type="button"
                          onClick={() => { field.onChange("public/logos/zivelo-bars-dark-full.svg"); setLogoMode("default") }}
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
                        <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background-secondary/20 px-6 py-8 text-center transition-colors hover:border-border-strong hover:bg-black/4">
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
                        <div className="flex items-center gap-4 rounded-xl border border-border bg-background-secondary/20 px-5 py-4">
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
              Acciones disponibles
            </p>
            <div className="flex flex-wrap gap-6">
              <FormField
                control={form.control}
                name="actions.approve"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-accent!"
                        />
                      </FormControl>
                      <FormLabel className="mb-0">Aprobar</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actions.askQuestion"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-accent!"
                        />
                      </FormControl>
                      <FormLabel className="mb-0">Hacer pregunta</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actions.downloadPdf"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-accent!"
                        />
                      </FormControl>
                      <FormLabel className="mb-0">Descargar PDF</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
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
            {submitting
              ? isEdit ? "Guardando…" : "Creando…"
              : isEdit ? "Guardar cambios" : "Crear cotización"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { QuoteForm as QuoteCreateForm }
