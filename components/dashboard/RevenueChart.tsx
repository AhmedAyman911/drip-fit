'use client'

import { useState } from "react"
import { formatMoney, formatWholeMoney } from "./orderStatusMeta"

interface Day {
  date: string
  revenue: number
  orders: number
}

const dayLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

export default function RevenueChart({ days }: { days: Day[] }) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(...days.map((day) => day.revenue), 0)
  const total = days.reduce((sum, day) => sum + day.revenue, 0)
  const shown = active !== null ? days[active] : null

  if (max === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No sales in the last {days.length} days yet.
      </div>
    )
  }

  return (
    <div>
      {/* Readout: the hovered day, or the period total when nothing is hovered */}
      <div className="mb-4 flex items-baseline justify-between gap-4" aria-live="polite">
        <p className="text-2xl font-semibold tabular-nums">{formatMoney(shown ? shown.revenue : total)}</p>
        <p className="text-sm text-muted-foreground">
          {shown
            ? `${dayLabel(shown.date)}, ${shown.orders} order${shown.orders === 1 ? "" : "s"}`
            : `Last ${days.length} days`}
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 border-t border-dashed" aria-hidden />
        <span className="absolute -top-2.5 right-0 bg-card pl-2 text-xs text-muted-foreground tabular-nums" aria-hidden>
          {formatWholeMoney(max)}
        </span>
        <ul
          className="flex h-44 items-end gap-0.5 border-b"
          onMouseLeave={() => setActive(null)}
          aria-label={`Revenue per day for the last ${days.length} days`}
        >
          {days.map((day, index) => (
            <li key={day.date} className="h-full flex-1">
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                aria-label={`${dayLabel(day.date)}: ${formatMoney(day.revenue)}, ${day.orders} orders`}
                className="group flex h-full w-full items-end justify-center px-px outline-none"
              >
                <span
                  className={`w-full max-w-7 rounded-t-[4px] transition-colors group-focus-visible:ring-2 group-focus-visible:ring-ring ${
                    active === null || active === index ? "bg-foreground" : "bg-foreground/25"
                  }`}
                  style={{ height: day.revenue > 0 ? `${Math.max((day.revenue / max) * 100, 2)}%` : "2px" }}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground" aria-hidden>
        <span>{dayLabel(days[0].date)}</span>
        <span>{dayLabel(days[Math.floor(days.length / 2)].date)}</span>
        <span>{dayLabel(days[days.length - 1].date)}</span>
      </div>
    </div>
  )
}
