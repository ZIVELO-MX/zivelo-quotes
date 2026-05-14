# Zivelo Quotes

Zivelo Quotes es una plataforma privada de SaaS y cotizaciones diseñada para centralizar, estandarizar y modernizar la forma en que Zivelo crea y presenta propuestas a clientes.

El objetivo inicial es resolver el flujo interno de cotizaciones de Zivelo mientras se construye infraestructura reutilizable que más adelante pueda evolucionar hacia una plataforma para clientes y un producto comercial reutilizable.

La plataforma se enfoca en entregar experiencias de cotización interactivas y visualmente ricas, en lugar de PDFs estáticos o documentos tradicionales.

## Visión General

La plataforma debe permitir que Zivelo pueda:

- Crear cotizaciones profesionales de forma interna
- Compartir propuestas visualmente ricas con clientes
- Presentar servicios como experiencias interactivas
- Reutilizar infraestructura en proyectos futuros
- Ofrecer potencialmente la plataforma a clientes en el futuro

El objetivo a largo plazo es dejar de reconstruir sistemas de propuestas desde cero y mantener una infraestructura reutilizable para cotizaciones.

## Posicionamiento Del Producto

Zivelo Quotes se posiciona como:

- Un SaaS privado administrado por Zivelo
- Una plataforma reutilizable de cotizaciones
- Una base para futuros módulos de negocio reutilizables

Durante la fase MVP, el sistema no está pensado como un SaaS público de autoservicio.

## Experiencia De Cotización

Las cotizaciones deben sentirse más cercanas a:

- Presentaciones interactivas
- Landing pages modernas
- Flujos de checkout estilo ecommerce

En lugar de:

- PDFs tradicionales
- Documentos estáticos
- Plantillas simples de propuesta

La experiencia del cliente debe permitir la presentación visual de ideas, ejemplos, componentes, mockups y wireframes.

## Estructura De URLs

Plataforma:

```txt
quotes.zivelo.dev
```

Dashboard:

```txt
quotes.zivelo.dev/dashboard
```

Cotizaciones públicas:

```txt
quotes.zivelo.dev/q/cafe-luna
quotes.zivelo.dev/q/gutven-web-corporativa
quotes.zivelo.dev/q/clinica-smile
```

La ruta pública de cotizaciones sigue esta estructura:

```txt
/q/{quote-slug}
```

## Sistema Open Graph

Cada cotización debe generar automáticamente una imagen Open Graph personalizada.

La imagen generada debe mejorar la forma en que se comparte la cotización por WhatsApp y plataformas sociales, crear una primera impresión premium antes de abrir la propuesta y reforzar la consistencia visual de la marca.

Las imágenes Open Graph deben generarse dinámicamente a partir de información de la cotización como:

- Nombre del cliente
- Nombre del servicio
- Título
- Colores de marca
- Contenido hero
- Logo
- CTA

## Alcance MVP - v0.1.0

El MVP se enfoca en resolver el flujo interno de cotizaciones de Zivelo.

### Incluido

- Dashboard interno de administración
- Creación de cotizaciones protegida por login
- Páginas públicas de cotización para compartir
- Slugs dinámicos para cotizaciones
- Presentación interactiva de cotizaciones
- Exportación a PDF
- Generación personalizada de Open Graph
- Templates de cotizacion
- Arquitectura reutilizable

### No Incluido

- Pagos
- Comentarios de clientes
- Cuentas de clientes
- Analytics
- Builder drag and drop
- Subscription billing
- CRM
- Sistemas de automatización
- Organizaciones multiusuario
- Dominios personalizados

## Dirección Técnica

La plataforma debe diseñarse con:

- Next.js
- Módulos reutilizables
- Shared UI
- Rutas dinámicas
- Render basado en templates

El sistema de cotizaciones no debe estar hardcodeado alrededor de páginas estáticas. Las cotizaciones deben comportarse como datos estructurados que se renderizan dinámicamente en experiencias interactivas.

## Estrategia Del Repositorio

Este repositorio contiene la plataforma de cotizaciones, el admin dashboard, el visor publico de cotizaciones, los shared UI/components y el shared quote engine.

El objetivo es mantener la plataforma reutilizable y portable.

## Filosofia De Deploy

El MVP debe ejecutarse como un deploy centralizado:

```txt
quotes.zivelo.dev
```

La arquitectura futura debe soportar hosting administrado de cotizaciones, dominios personalizados de clientes y deploys dedicados para clientes premium.

## Documentación

- [Arquitectura](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
