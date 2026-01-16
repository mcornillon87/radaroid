# 🎨 Radaroid — Design System v1.2 Addendum

> **Complément au Design System v1.1** — Patterns avancés pour le comparateur

**Version :** 1.2 (Addendum)  
**Date :** Janvier 2026  
**Prérequis :** Lire `Radaroid-Design-System-v1.1.md` en premier  
**Scope :** Filtres, Comparateur, Error Reporting, OG Images

---

## Table des Matières

1. [Changelog v1.1 → v1.2](#1-changelog-v11--v12)
2. [FilterPanel System](#2-filterpanel-system)
3. [ComparisonTable (Le Boss Final)](#3-comparisontable-le-boss-final)
4. [ErrorReportDialog](#4-errorreportdialog)
5. [OG Image Templates](#5-og-image-templates)
6. [Corrections v1.1](#6-corrections-v11)

---

## 1. Changelog v1.1 → v1.2

| Élément | v1.1 | v1.2 |
|---------|------|------|
| **FilterPanel** | ❌ Non défini | ✅ Drawer mobile + Sidebar desktop + Pills |
| **ComparisonTable** | ❌ Mentionné seulement | ✅ Specs complètes avec sticky scroll |
| **ErrorReportDialog** | ❌ Table SQL seulement | ✅ Composant UI complet |
| **OG Images** | ❌ Non défini | ✅ Template pour social sharing |
| **Icône Pilote** | ⚠️ `AlertTriangle` | ✅ `Rocket` (moins anxiogène) |
| **Skeleton Table** | ⚠️ Hauteur variable | ✅ Hauteur fixe (`h-14`) |

---

## 2. FilterPanel System

### 2.1 Architecture Responsive

```
┌─────────────────────────────────────────────────────────────────┐
│                        DESKTOP (≥1024px)                        │
│  ┌──────────────┐  ┌─────────────────────────────────────────┐  │
│  │              │  │                                         │  │
│  │   SIDEBAR    │  │              CONTENT                    │  │
│  │   (Sticky)   │  │              (Grid)                     │  │
│  │              │  │                                         │  │
│  │  □ Filter 1  │  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │  │
│  │  □ Filter 2  │  │  │Card │ │Card │ │Card │ │Card │       │  │
│  │              │  │  └─────┘ └─────┘ └─────┘ └─────┘       │  │
│  │  [Slider]    │  │                                         │  │
│  │              │  │                                         │  │
│  │  [Reset]     │  │                                         │  │
│  │              │  │                                         │  │
│  └──────────────┘  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        MOBILE (<1024px)                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [Filter Button]  [Sort ▼]           12 résultats       │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Active Filters:  [🟢 Production ×] [>50kg ×] [Clear]   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    CONTENT (Stack)                      │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │                   Card                          │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │                   Card                          │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ════════════════════════════════════════════════════════════   │
│  │                  DRAWER (Sheet)                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  Filtres                              [×]       │    │    │
│  │  │                                                 │    │    │
│  │  │  Statut                                         │    │    │
│  │  │  ☑ Production  ☐ Pilote  ☐ Prototype           │    │    │
│  │  │                                                 │    │    │
│  │  │  Charge utile                                   │    │    │
│  │  │  [====●==========] 0kg — 100kg                  │    │    │
│  │  │                                                 │    │    │
│  │  │  Prix                                           │    │    │
│  │  │  [==●============] $0 — $500k                   │    │    │
│  │  │                                                 │    │    │
│  │  │  ─────────────────────────────────────────────  │    │    │
│  │  │  [Réinitialiser]           [Voir 12 résultats]  │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  ════════════════════════════════════════════════════════════   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Composant FilterSidebar (Desktop)

```tsx
// components/filters/filter-sidebar.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { RotateCcw } from 'lucide-react'

interface FilterState {
  status: string[]
  payloadRange: [number, number]
  priceRange: [number, number]
  brands: string[]
}

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableBrands: { id: string; name: string }[]
}

const statusOptions = [
  { value: 'production', label: 'Production', icon: '🟢' },
  { value: 'pilot', label: 'Pilote', icon: '🟠' },
  { value: 'prototype', label: 'Prototype', icon: '🟡' },
]

export function FilterSidebar({ 
  filters, 
  onFiltersChange,
  availableBrands 
}: FilterSidebarProps) {
  
  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked 
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status)
    onFiltersChange({ ...filters, status: newStatus })
  }

  const handleReset = () => {
    onFiltersChange({
      status: [],
      payloadRange: [0, 100],
      priceRange: [0, 500000],
      brands: [],
    })
  }

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.brands.length > 0 ||
    filters.payloadRange[0] > 0 ||
    filters.payloadRange[1] < 100 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500000

  return (
    <aside 
      className="w-64 shrink-0 sticky top-20 h-fit"
      role="search"
      aria-label="Filtres de recherche"
    >
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Filtres</h2>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-700"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Status Filter */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-700">
            Statut de maturité
          </legend>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={filters.status.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleStatusChange(option.value, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`status-${option.value}`}
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  <span aria-hidden="true">{option.icon}</span> {option.label}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Payload Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">
            Charge utile
          </Label>
          <Slider
            value={filters.payloadRange}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, payloadRange: value as [number, number] })
            }
            min={0}
            max={100}
            step={5}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>{filters.payloadRange[0]}kg</span>
            <span>{filters.payloadRange[1]}kg</span>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">
            Prix estimé
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, priceRange: value as [number, number] })
            }
            min={0}
            max={500000}
            step={10000}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>${(filters.priceRange[0] / 1000).toFixed(0)}k</span>
            <span>${(filters.priceRange[1] / 1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Brands */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-700">
            Fabricant
          </legend>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableBrands.map((brand) => (
              <div key={brand.id} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={filters.brands.includes(brand.id)}
                  onCheckedChange={(checked) => {
                    const newBrands = checked
                      ? [...filters.brands, brand.id]
                      : filters.brands.filter(b => b !== brand.id)
                    onFiltersChange({ ...filters, brands: newBrands })
                  }}
                />
                <Label 
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  {brand.name}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>

      </div>
    </aside>
  )
}
```

### 2.3 Composant FilterDrawer (Mobile)

```tsx
// components/filters/filter-drawer.tsx

'use client'

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter,
  SheetTrigger 
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SlidersHorizontal } from 'lucide-react'

interface FilterDrawerProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableBrands: { id: string; name: string }[]
  resultCount: number
  children: React.ReactNode // Le contenu du filtre (réutilise FilterSidebar internals)
}

export function FilterDrawer({ 
  filters, 
  onFiltersChange,
  resultCount,
  children 
}: FilterDrawerProps) {
  
  const activeFiltersCount = 
    filters.status.length + 
    filters.brands.length +
    (filters.payloadRange[0] > 0 || filters.payloadRange[1] < 100 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000 ? 1 : 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Filtres</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          {children}
        </div>
        
        <SheetFooter className="flex-row gap-3 border-t pt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onFiltersChange({
              status: [],
              payloadRange: [0, 100],
              priceRange: [0, 500000],
              brands: [],
            })}
          >
            Réinitialiser
          </Button>
          <SheetTrigger asChild>
            <Button className="flex-1">
              Voir {resultCount} résultat{resultCount > 1 ? 's' : ''}
            </Button>
          </SheetTrigger>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

### 2.4 Composant ActiveFilterPills

Les "pills" qui montrent les filtres actifs et permettent de les supprimer en un clic.

```tsx
// components/filters/active-filter-pills.tsx

'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FilterPill {
  id: string
  label: string
  type: 'status' | 'brand' | 'payload' | 'price'
}

interface ActiveFilterPillsProps {
  pills: FilterPill[]
  onRemove: (pill: FilterPill) => void
  onClearAll: () => void
}

export function ActiveFilterPills({ 
  pills, 
  onRemove, 
  onClearAll 
}: ActiveFilterPillsProps) {
  if (pills.length === 0) return null

  return (
    <div 
      className="flex flex-wrap items-center gap-2"
      role="region"
      aria-label="Filtres actifs"
    >
      <span className="text-sm text-slate-500">Filtres :</span>
      
      {pills.map((pill) => (
        <button
          key={pill.id}
          onClick={() => onRemove(pill)}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full",
            "text-xs font-medium",
            "bg-blue-50 text-blue-700 border border-blue-200",
            "hover:bg-blue-100 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          )}
          aria-label={`Supprimer le filtre: ${pill.label}`}
        >
          <span>{pill.label}</span>
          <X className="w-3 h-3" aria-hidden="true" />
        </button>
      ))}
      
      {pills.length > 1 && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearAll}
          className="text-slate-500 hover:text-slate-700 text-xs"
        >
          Tout effacer
        </Button>
      )}
    </div>
  )
}
```

### 2.5 Hook useFilters

```tsx
// hooks/use-filters.ts

'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

interface FilterState {
  status: string[]
  payloadRange: [number, number]
  priceRange: [number, number]
  brands: string[]
}

const defaultFilters: FilterState = {
  status: [],
  payloadRange: [0, 100],
  priceRange: [0, 500000],
  brands: [],
}

export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse URL params to filter state
  const filters = useMemo<FilterState>(() => {
    return {
      status: searchParams.get('status')?.split(',').filter(Boolean) || [],
      brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
      payloadRange: [
        parseInt(searchParams.get('payload_min') || '0'),
        parseInt(searchParams.get('payload_max') || '100'),
      ],
      priceRange: [
        parseInt(searchParams.get('price_min') || '0'),
        parseInt(searchParams.get('price_max') || '500000'),
      ],
    }
  }, [searchParams])

  // Update URL with new filters
  const setFilters = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    if (newFilters.status.length > 0) {
      params.set('status', newFilters.status.join(','))
    }
    if (newFilters.brands.length > 0) {
      params.set('brands', newFilters.brands.join(','))
    }
    if (newFilters.payloadRange[0] > 0) {
      params.set('payload_min', newFilters.payloadRange[0].toString())
    }
    if (newFilters.payloadRange[1] < 100) {
      params.set('payload_max', newFilters.payloadRange[1].toString())
    }
    if (newFilters.priceRange[0] > 0) {
      params.set('price_min', newFilters.priceRange[0].toString())
    }
    if (newFilters.priceRange[1] < 500000) {
      params.set('price_max', newFilters.priceRange[1].toString())
    }

    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { 
      scroll: false 
    })
  }, [router, pathname])

  // Generate pills from current filters
  const pills = useMemo(() => {
    const result: FilterPill[] = []
    
    filters.status.forEach(s => {
      const labels = { production: '🟢 Production', pilot: '🟠 Pilote', prototype: '🟡 Prototype' }
      result.push({ id: `status-${s}`, label: labels[s] || s, type: 'status' })
    })
    
    filters.brands.forEach(b => {
      result.push({ id: `brand-${b}`, label: b, type: 'brand' })
    })
    
    if (filters.payloadRange[0] > 0 || filters.payloadRange[1] < 100) {
      result.push({ 
        id: 'payload', 
        label: `${filters.payloadRange[0]}-${filters.payloadRange[1]}kg`, 
        type: 'payload' 
      })
    }
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) {
      result.push({ 
        id: 'price', 
        label: `$${filters.priceRange[0]/1000}k-$${filters.priceRange[1]/1000}k`, 
        type: 'price' 
      })
    }
    
    return result
  }, [filters])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [setFilters])

  return { filters, setFilters, pills, resetFilters }
}
```

---

## 3. ComparisonTable (Le Boss Final)

### 3.1 Le Défi Technique

La Comparison Table est le composant le plus complexe du projet car elle nécessite :

1. **Double Sticky** : Header (noms robots) ET première colonne (noms attributs)
2. **Scroll horizontal synchronisé** : Sur mobile, le contenu scrolle horizontalement
3. **Highlighting des différences** : Mettre en valeur les écarts significatifs
4. **Responsive intelligent** : Max 2 robots sur mobile, 4+ sur desktop

### 3.2 Architecture Visuelle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          COMPARISON TABLE                                   │
│                                                                             │
│  DESKTOP (≥1024px)                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ STICKY HEADER                                                       │    │
│  │ ┌────────────┬────────────┬────────────┬────────────┬─────────────┐ │    │
│  │ │            │  Optimus   │  Figure 02 │  Unitree   │    NEO      │ │    │
│  │ │  Attribut  │  [img]     │  [img]     │  [img]     │   [img]     │ │    │
│  │ │            │  ★ 85/100  │  ★ 82/100  │  ★ 78/100  │  ★ 72/100   │ │    │
│  │ └────────────┴────────────┴────────────┴────────────┴─────────────┘ │    │
│  │ ┌────────────┬────────────┬────────────┬────────────┬─────────────┐ │    │
│  │ │ Prix       │  ~$25k     │  ~$50k     │  ~$90k     │    N/A      │ │    │
│  │ ├────────────┼────────────┼────────────┼────────────┼─────────────┤ │    │
│  │ │ Poids      │  57kg      │  60kg ▲    │  47kg      │   52kg      │ │    │
│  │ ├────────────┼────────────┼────────────┼────────────┼─────────────┤ │    │
│  │ │ Charge     │  20kg ★    │  15kg      │  30kg ★★   │   10kg      │ │    │
│  │ ├────────────┼────────────┼────────────┼────────────┼─────────────┤ │    │
│  │ │ Autonomie  │  5h        │  8h ★★     │  4h        │   6h        │ │    │
│  │ ├────────────┼────────────┼────────────┼────────────┼─────────────┤ │    │
│  │ │ Maturité   │ 🟡 Proto   │ 🟠 Pilote  │ 🟢 Prod    │  🟡 Proto   │ │    │
│  │ └────────────┴────────────┴────────────┴────────────┴─────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  MOBILE (<768px)                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ◀ Swipe ▶                                       1 / 4              │    │
│  │ ┌────────────┬────────────┬────────────┐  ← Scroll horizontal       │    │
│  │ │            │  Optimus   │  Figure 02 │                            │    │
│  │ │  Attribut  │  [img]     │  [img]     │  (autres robots masqués)   │    │
│  │ │  (STICKY)  │  ★ 85      │  ★ 82      │                            │    │
│  │ ├────────────┼────────────┼────────────┤                            │    │
│  │ │ Prix       │  ~$25k     │  ~$50k     │                            │    │
│  │ ├────────────┼────────────┼────────────┤                            │    │
│  │ │ Poids      │  57kg      │  60kg      │                            │    │
│  │ └────────────┴────────────┴────────────┘                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Structure HTML/CSS (Le Secret)

Le secret d'une comparison table performante : **CSS Grid avec sticky**.

```tsx
// components/compare/comparison-table.tsx

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { MaturityBadge } from '@/components/scores/maturity-badge'
import { ScoreGauge } from '@/components/scores/score-gauge'

interface Robot {
  id: string
  slug: string
  name: string
  brand: string
  heroImage: { url: string; blur_data_url: string }
  score: number
  status: 'prototype' | 'pilot' | 'production'
  deploymentsCount: number
  specs: Record<string, any>
}

interface ComparisonAttribute {
  key: string
  label: string
  unit?: string
  type: 'number' | 'text' | 'boolean' | 'status'
  highlight?: 'highest' | 'lowest' // Quel est le "meilleur" ?
}

interface ComparisonTableProps {
  robots: Robot[]
  attributes: ComparisonAttribute[]
  jobSlug?: string // Pour contextualiser le score
}

export function ComparisonTable({ 
  robots, 
  attributes,
  jobSlug 
}: ComparisonTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Calculer les "gagnants" par attribut
  const getWinner = (attr: ComparisonAttribute) => {
    if (attr.type !== 'number' || !attr.highlight) return null
    
    const values = robots.map(r => ({
      id: r.id,
      value: r.specs[attr.key] as number
    })).filter(v => v.value !== undefined && v.value !== null)
    
    if (values.length === 0) return null
    
    const sorted = [...values].sort((a, b) => 
      attr.highlight === 'highest' ? b.value - a.value : a.value - b.value
    )
    
    return sorted[0]?.id
  }

  return (
    <div className="w-full">
      {/* Mobile scroll indicator */}
      <div className="lg:hidden flex items-center justify-between text-sm text-slate-500 mb-2 px-2">
        <span>◀ Glissez pour comparer ▶</span>
        <span>{robots.length} robots</span>
      </div>

      {/* Table Container with horizontal scroll */}
      <div 
        ref={scrollRef}
        className={cn(
          "overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300",
          "-mx-4 px-4 lg:mx-0 lg:px-0" // Full bleed on mobile
        )}
      >
        <table 
          className="w-full border-collapse min-w-[600px]"
          role="table"
          aria-label="Comparaison des robots"
        >
          {/* Header with robot cards */}
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              {/* Empty corner cell - sticky left */}
              <th 
                className={cn(
                  "sticky left-0 z-20 bg-white",
                  "w-40 min-w-[160px] p-3",
                  "border-b border-r border-slate-200",
                  "text-left text-sm font-medium text-slate-500"
                )}
              >
                <span className="sr-only">Attribut</span>
              </th>
              
              {/* Robot headers */}
              {robots.map((robot) => (
                <th 
                  key={robot.id}
                  className={cn(
                    "p-3 min-w-[180px]",
                    "border-b border-slate-200",
                    "text-center"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    {/* Robot image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                      <Image
                        src={robot.heroImage.url}
                        alt={robot.name}
                        fill
                        placeholder="blur"
                        blurDataURL={robot.heroImage.blur_data_url}
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Robot name */}
                    <div>
                      <p className="text-xs text-slate-500">{robot.brand}</p>
                      <p className="font-semibold text-slate-900">{robot.name}</p>
                    </div>
                    
                    {/* Score */}
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-mono font-bold text-blue-600">
                        {robot.score}
                      </span>
                      <span className="text-xs text-slate-500">/100</span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {attributes.map((attr, index) => {
              const winnerId = getWinner(attr)
              
              return (
                <tr 
                  key={attr.key}
                  className={cn(
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  )}
                >
                  {/* Attribute label - sticky left */}
                  <td 
                    className={cn(
                      "sticky left-0 z-10",
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50',
                      "p-3 border-r border-slate-200",
                      "text-sm font-medium text-slate-700"
                    )}
                  >
                    {attr.label}
                    {attr.unit && (
                      <span className="text-slate-400 ml-1">({attr.unit})</span>
                    )}
                  </td>
                  
                  {/* Values for each robot */}
                  {robots.map((robot) => {
                    const value = robot.specs[attr.key]
                    const isWinner = winnerId === robot.id
                    
                    return (
                      <td 
                        key={`${robot.id}-${attr.key}`}
                        className={cn(
                          "p-3 text-center",
                          isWinner && "bg-emerald-50"
                        )}
                      >
                        {attr.type === 'status' ? (
                          <div className="flex justify-center">
                            <MaturityBadge 
                              status={robot.status} 
                              deploymentsCount={robot.deploymentsCount}
                            />
                          </div>
                        ) : attr.type === 'boolean' ? (
                          <span className={cn(
                            "inline-flex items-center justify-center w-6 h-6 rounded-full",
                            value ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                          )}>
                            {value ? '✓' : '—'}
                          </span>
                        ) : (
                          <span className={cn(
                            "font-mono",
                            isWinner && "font-bold text-emerald-700",
                            value === undefined && "text-slate-400"
                          )}>
                            {value !== undefined ? (
                              <>
                                {typeof value === 'number' ? value.toLocaleString() : value}
                                {attr.unit && <span className="text-slate-400 ml-0.5">{attr.unit}</span>}
                                {isWinner && <span className="ml-1">★</span>}
                              </>
                            ) : (
                              'N/A'
                            )}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

### 3.4 CSS Spécifique (Scrollbar Custom)

```css
/* globals.css */

/* Custom scrollbar for comparison table */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #CBD5E1;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #94A3B8;
}

/* Hide scrollbar on mobile but keep functionality */
@media (max-width: 768px) {
  .scrollbar-thin::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-thin {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

### 3.5 Attributs Standard pour Comparaison

```tsx
// lib/compare/default-attributes.ts

export const defaultComparisonAttributes: ComparisonAttribute[] = [
  { key: 'price_estimate', label: 'Prix estimé', type: 'text' },
  { key: 'status', label: 'Maturité', type: 'status' },
  { key: 'height_cm', label: 'Hauteur', unit: 'cm', type: 'number' },
  { key: 'weight_kg', label: 'Poids', unit: 'kg', type: 'number', highlight: 'lowest' },
  { key: 'payload_kg', label: 'Charge utile', unit: 'kg', type: 'number', highlight: 'highest' },
  { key: 'runtime_hours', label: 'Autonomie', unit: 'h', type: 'number', highlight: 'highest' },
  { key: 'max_speed_kmh', label: 'Vitesse max', unit: 'km/h', type: 'number', highlight: 'highest' },
  { key: 'dof_count', label: 'DoF (Degrés de liberté)', type: 'number', highlight: 'highest' },
  { key: 'has_lidar', label: 'LiDAR', type: 'boolean' },
  { key: 'has_vision', label: 'Vision IA', type: 'boolean' },
  { key: 'wms_integration', label: 'Intégration WMS', type: 'boolean' },
  { key: 'ip_rating', label: 'Indice IP', type: 'text' },
]
```

### 3.6 Page Compare (Route)

```tsx
// app/compare/[...slugs]/page.tsx

import { notFound } from 'next/navigation'
import { ComparisonTable } from '@/components/compare/comparison-table'
import { defaultComparisonAttributes } from '@/lib/compare/default-attributes'
import { getRobotsBySlugs } from '@/lib/data/robots'

interface ComparePageProps {
  params: { slugs: string[] }
}

export default async function ComparePage({ params }: ComparePageProps) {
  // Parse slugs: /compare/optimus-vs-figure-02-vs-unitree-h1
  const slugsString = params.slugs[0] || ''
  const robotSlugs = slugsString.split('-vs-').filter(Boolean)
  
  if (robotSlugs.length < 2) {
    notFound()
  }
  
  if (robotSlugs.length > 5) {
    // Limite à 5 robots max pour lisibilité
    robotSlugs.splice(5)
  }

  const robots = await getRobotsBySlugs(robotSlugs)
  
  if (robots.length < 2) {
    notFound()
  }

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Comparatif : {robots.map(r => r.name).join(' vs ')}
      </h1>
      <p className="text-slate-600 mb-8">
        Analyse technique détaillée de {robots.length} robots humanoïdes
      </p>
      
      <ComparisonTable 
        robots={robots}
        attributes={defaultComparisonAttributes}
      />
    </main>
  )
}

// SEO
export async function generateMetadata({ params }: ComparePageProps) {
  const slugsString = params.slugs[0] || ''
  const robotSlugs = slugsString.split('-vs-').filter(Boolean)
  
  return {
    title: `${robotSlugs.join(' vs ')} - Comparatif Robot | Radaroid`,
    description: `Comparaison technique détaillée entre ${robotSlugs.join(', ')}. Specs, prix, autonomie et scores Radaroid.`,
  }
}
```

---

## 4. ErrorReportDialog

### 4.1 Specs UX

- **Trigger** : Lien discret en bas de chaque fiche robot et sur chaque spec (hover/tap)
- **Pré-remplissage** : Le dialog connaît déjà le `robot_id` et le `field_name` si cliqué depuis une spec
- **Champs** : Description (obligatoire), Email (optionnel), Source/Preuve (optionnel)
- **Feedback** : Message de confirmation + mention que ça sera vérifié

### 4.2 Composant ErrorReportDialog

```tsx
// components/feedback/error-report-dialog.tsx

'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { AlertTriangle, CheckCircle, Flag } from 'lucide-react'

interface ErrorReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entityType: 'robot' | 'deployment' | 'job'
  entityId: string
  entityName: string
  fieldName?: string // Si le signalement concerne un champ spécifique
  fieldValue?: string // Valeur actuelle du champ (pour contexte)
}

export function ErrorReportDialog({
  open,
  onOpenChange,
  entityType,
  entityId,
  entityName,
  fieldName,
  fieldValue,
}: ErrorReportDialogProps) {
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await fetch('/api/error-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          field_name: fieldName,
          current_value: fieldValue,
          description,
          reported_by_email: email || null,
          source_url: sourceUrl || null,
        }),
      })

      setIsSuccess(true)
      
      // Reset et fermer après délai
      setTimeout(() => {
        onOpenChange(false)
        setIsSuccess(false)
        setDescription('')
        setEmail('')
        setSourceUrl('')
      }, 2500)
    } catch (error) {
      console.error('Error submitting report:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
      setIsSuccess(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          // Success state
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Merci pour votre signalement !
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Notre équipe va vérifier cette information sous 48h.
              </p>
            </div>
          </div>
        ) : (
          // Form state
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-amber-500" />
                Signaler une erreur
              </DialogTitle>
              <DialogDescription>
                Vous avez repéré une information incorrecte ? Aidez-nous à améliorer nos données.
              </DialogDescription>
            </DialogHeader>

            {/* Context banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-sm">
              <p className="text-slate-600">
                <span className="font-medium">Concernant :</span>{' '}
                <span className="text-slate-900">{entityName}</span>
              </p>
              {fieldName && (
                <p className="text-slate-600 mt-1">
                  <span className="font-medium">Champ :</span>{' '}
                  <span className="text-slate-900">{fieldName}</span>
                  {fieldValue && (
                    <span className="text-slate-500 ml-1">
                      (actuellement : <code className="font-mono text-xs bg-slate-100 px-1 rounded">{fieldValue}</code>)
                    </span>
                  )}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Description - Required */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Quelle est l'erreur ?
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </Label>
                <Textarea
                  id="description"
                  required
                  placeholder="Ex: Le poids indiqué est 57kg mais la fiche officielle Tesla indique 73kg..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Source URL - Optional */}
              <div className="space-y-2">
                <Label htmlFor="source-url">
                  Source (lien)
                  <span className="text-slate-400 ml-1 text-xs font-normal">optionnel</span>
                </Label>
                <Input
                  id="source-url"
                  type="url"
                  placeholder="https://..."
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Un lien vers la source officielle nous aide à vérifier plus vite.
                </p>
              </div>

              {/* Email - Optional */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Votre email
                  <span className="text-slate-400 ml-1 text-xs font-normal">optionnel</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Pour vous notifier quand la correction sera appliquée.
                </p>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !description.trim()}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" />
                      Envoi...
                    </>
                  ) : (
                    'Envoyer le signalement'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

### 4.3 Trigger Inline (Pour les Specs)

Un petit bouton discret au hover sur chaque spec.

```tsx
// components/feedback/report-spec-button.tsx

'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { ErrorReportDialog } from './error-report-dialog'
import { cn } from '@/lib/utils'

interface ReportSpecButtonProps {
  robotId: string
  robotName: string
  fieldName: string
  fieldValue: string
}

export function ReportSpecButton({
  robotId,
  robotName,
  fieldName,
  fieldValue,
}: ReportSpecButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "opacity-0 group-hover:opacity-100",
          "p-1 rounded text-slate-400 hover:text-amber-500 hover:bg-amber-50",
          "transition-all duration-150",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        )}
        aria-label={`Signaler une erreur sur ${fieldName}`}
      >
        <Flag className="w-3 h-3" />
      </button>

      <ErrorReportDialog
        open={open}
        onOpenChange={setOpen}
        entityType="robot"
        entityId={robotId}
        entityName={robotName}
        fieldName={fieldName}
        fieldValue={fieldValue}
      />
    </>
  )
}

// Usage dans une spec row:
// <tr className="group">
//   <td>Poids</td>
//   <td className="flex items-center gap-2">
//     <span>57kg</span>
//     <ReportSpecButton robotId="xxx" robotName="Optimus" fieldName="Poids" fieldValue="57kg" />
//   </td>
// </tr>
```

---

## 5. OG Image Templates

### 5.1 Specs Design

Pour la viralité sur Twitter/LinkedIn, chaque page doit générer une OG image dynamique.

**Format :** 1200 x 630 px (ratio 1.91:1)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  OG IMAGE - ROBOT PAGE                                                      │
│  1200 x 630 px                                                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  ┌─────────┐                                                        │    │
│  │  │         │   TESLA                                                │    │
│  │  │  ROBOT  │   OPTIMUS GEN 2                                        │    │
│  │  │  IMAGE  │                                                        │    │
│  │  │  200px  │   ┌───────────────────────────────┐                    │    │
│  │  │         │   │                               │                    │    │
│  │  └─────────┘   │      85 /100                  │                    │    │
│  │                │      ★ Warehouse Picking      │                    │    │
│  │                │                               │                    │    │
│  │                └───────────────────────────────┘                    │    │
│  │                                                                     │    │
│  │  🟡 PROTOTYPE                              radaroid.com             │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Background: Slate-900 (#0F172A)                                            │
│  Score: Emerald-400 (#34D399) si >70, Amber-400 si 40-70, Red-400 si <40   │
│  Text: White                                                                │
│  Badge: Couleur selon statut                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Route API Next.js (Image Generation)

```tsx
// app/api/og/robot/[slug]/route.tsx

import { ImageResponse } from 'next/og'
import { getRobotBySlug } from '@/lib/data/robots'

export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const robot = await getRobotBySlug(params.slug)
  
  if (!robot) {
    return new Response('Not found', { status: 404 })
  }

  // Charger les fonts
  const interBold = await fetch(
    new URL('../../../../public/fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())
  
  const jetbrainsMono = await fetch(
    new URL('../../../../public/fonts/JetBrainsMono-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  // Couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#34D399' // Emerald
    if (score >= 40) return '#FBBF24' // Amber
    return '#F87171' // Red
  }

  // Couleur du badge
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'production': return { bg: '#D1FAE5', text: '#065F46' }
      case 'pilot': return { bg: '#FFEDD5', text: '#9A3412' }
      default: return { bg: '#FEF3C7', text: '#92400E' }
    }
  }

  const badgeStyle = getBadgeStyle(robot.status)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#0F172A',
          padding: '48px',
        }}
      >
        {/* Left: Robot Image */}
        <div
          style={{
            width: '280px',
            height: '280px',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#1E293B',
            marginRight: '48px',
          }}
        >
          {robot.heroImage?.url && (
            <img
              src={robot.heroImage.url}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>

        {/* Right: Info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          {/* Brand */}
          <p
            style={{
              fontSize: '24px',
              color: '#94A3B8',
              fontFamily: 'Inter',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {robot.brand}
          </p>

          {/* Name */}
          <h1
            style={{
              fontSize: '56px',
              color: '#FFFFFF',
              fontFamily: 'Inter',
              fontWeight: 700,
              margin: '8px 0 24px 0',
              lineHeight: 1.1,
            }}
          >
            {robot.name}
          </h1>

          {/* Score Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                fontSize: '96px',
                fontFamily: 'JetBrains Mono',
                fontWeight: 700,
                color: getScoreColor(robot.score),
                lineHeight: 1,
              }}
            >
              {robot.score}
            </span>
            <span
              style={{
                fontSize: '32px',
                color: '#64748B',
                fontFamily: 'JetBrains Mono',
              }}
            >
              /100
            </span>
          </div>

          {/* Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span
              style={{
                backgroundColor: badgeStyle.bg,
                color: badgeStyle.text,
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '18px',
                fontFamily: 'Inter',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {robot.status === 'production' ? '🟢 Production' : 
               robot.status === 'pilot' ? '🟠 Pilote' : '🟡 Prototype'}
            </span>
          </div>
        </div>

        {/* Watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              color: '#475569',
              fontFamily: 'Inter',
            }}
          >
            radaroid.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interBold, style: 'normal', weight: 700 },
        { name: 'JetBrains Mono', data: jetbrainsMono, style: 'normal', weight: 700 },
      ],
    }
  )
}
```

### 5.3 Utilisation dans les Pages

```tsx
// app/robots/[slug]/page.tsx

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const robot = await getRobotBySlug(params.slug)
  
  if (!robot) return {}

  const ogImageUrl = `https://radaroid.com/api/og/robot/${params.slug}`

  return {
    title: `${robot.name} - Specs & Scores | Radaroid`,
    description: `${robot.name} par ${robot.brand}. Score technique: ${robot.score}/100. Voir les specs complètes et les avis.`,
    openGraph: {
      title: `${robot.name} - ${robot.score}/100 | Radaroid`,
      description: `Analyse technique complète de ${robot.name}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${robot.name} - Score ${robot.score}/100`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${robot.name} - ${robot.score}/100`,
      description: `Analyse technique par Radaroid`,
      images: [ogImageUrl],
    },
  }
}
```

### 5.4 Template OG pour Pages Job

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  OG IMAGE - JOB PAGE                                                        │
│  1200 x 630 px                                                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │        🍽️                                                           │    │
│  │                                                                     │    │
│  │  ROBOTS SERVEURS                                                    │    │
│  │  Classement 2026                                                    │    │
│  │                                                                     │    │
│  │  ─────────────────────────────────────────────────                  │    │
│  │                                                                     │    │
│  │  🥇 Figure 02         85/100                                        │    │
│  │  🥈 Tesla Optimus     78/100                                        │    │
│  │  🥉 Unitree H1        65/100                                        │    │
│  │                                                                     │    │
│  │                                            radaroid.com             │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Background: White                                                          │
│  Icon: Job emoji grande taille (80px)                                       │
│  Title: Slate-900, Bold                                                     │
│  Ranking: Top 3 avec scores en mono                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Corrections v1.1

### 6.1 Icône Pilote : AlertTriangle → Rocket

**Problème :** `AlertTriangle` évoque une erreur/warning, pas un "work in progress".

**Solution :** Utiliser `Rocket` (lancement) ou `HardHat` (chantier).

```tsx
// components/scores/maturity-badge.tsx

// AVANT
import { FlaskConical, AlertTriangle, CheckCircle } from 'lucide-react'

const statusConfig = {
  // ...
  pilot: {
    icon: AlertTriangle, // ❌ Trop négatif
    // ...
  },
}

// APRÈS
import { FlaskConical, Rocket, CheckCircle } from 'lucide-react'

const statusConfig = {
  lab: {
    icon: FlaskConical,
    label: 'Lab Only',
    description: 'Score basé uniquement sur les specs',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    text: 'text-slate-700',
    iconColor: 'text-slate-500',
  },
  prototype: {
    icon: FlaskConical,
    label: 'Prototype',
    description: 'En développement',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    iconColor: 'text-amber-600',
  },
  pilot: {
    icon: Rocket, // ✅ Plus positif : "En lancement"
    label: 'Pilote',
    description: 'Déploiements pilotes en cours',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    iconColor: 'text-orange-600',
  },
  production: {
    icon: CheckCircle,
    label: 'Production',
    description: 'Déployé commercialement',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    iconColor: 'text-emerald-600',
  },
}
```

### 6.2 Skeleton Table : Hauteur Fixe

**Problème :** Les skeletons de hauteur variable causent du CLS (Cumulative Layout Shift).

**Solution :** Forcer une hauteur fixe qui correspond à la hauteur réelle des lignes.

```tsx
// components/ui/table-skeleton.tsx

// AVANT
<div className="flex gap-4 px-4 py-3 border-b border-slate-100">
  <Skeleton className="h-4 w-8" />
  <Skeleton className="h-4 w-40" />
  <Skeleton className="h-4 w-12" />
  <Skeleton className="h-6 w-16 rounded-full" />
</div>

// APRÈS - Hauteur fixe correspondant aux vraies rows
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 h-14 border-b border-slate-100">
      <Skeleton className="h-4 w-8 shrink-0" />
      <Skeleton className="h-4 w-40 shrink-0" />
      <Skeleton className="h-4 w-12 shrink-0" />
      <Skeleton className="h-6 w-20 rounded-full shrink-0" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Header skeleton - hauteur fixe */}
      <div className="flex items-center gap-4 px-4 h-12 bg-slate-50 border-b border-slate-200">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      
      {/* Rows - hauteur fixe identique aux vraies rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  )
}
```

---

## Checklist v1.2

| Composant | Fichier | States | Responsive | A11y | Tests |
|-----------|---------|--------|------------|------|-------|
| FilterSidebar | `components/filters/filter-sidebar.tsx` | ✅ | ✅ Desktop only | ✅ | ⬜ |
| FilterDrawer | `components/filters/filter-drawer.tsx` | ✅ | ✅ Mobile only | ✅ | ⬜ |
| ActiveFilterPills | `components/filters/active-filter-pills.tsx` | ✅ | ✅ | ✅ | ⬜ |
| useFilters | `hooks/use-filters.ts` | N/A | N/A | N/A | ⬜ |
| ComparisonTable | `components/compare/comparison-table.tsx` | ✅ | ✅ | ⚠️ | ⬜ |
| ErrorReportDialog | `components/feedback/error-report-dialog.tsx` | ✅ | ✅ | ✅ | ⬜ |
| ReportSpecButton | `components/feedback/report-spec-button.tsx` | ✅ | ✅ | ✅ | ⬜ |
| OG Robot Image | `app/api/og/robot/[slug]/route.tsx` | N/A | N/A | N/A | ⬜ |
| MaturityBadge (fix) | `components/scores/maturity-badge.tsx` | ✅ | ✅ | ✅ | ⬜ |
| TableSkeleton (fix) | `components/ui/table-skeleton.tsx` | ✅ | ✅ | ✅ | ⬜ |

---

## Prochaines Étapes

### v1.3 (Suggestions pour plus tard)

1. **SearchCommand** : Composant de recherche globale (⌘K) avec Cmdk
2. **Toast System** : Notifications pour actions (error report envoyé, etc.)
3. **Dark Mode** : Si demandé par les users
4. **Print Stylesheet** : Pour exporter les comparatifs en PDF

---

**Document créé le :** Janvier 2026  
**Version :** 1.2 Addendum  
**À utiliser avec :** `Radaroid-Design-System-v1.1.md`  

*Les corrections de ce document (icône Pilote, skeleton heights) doivent être appliquées rétroactivement dans les composants de la v1.1.*
