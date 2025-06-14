"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import type { Print } from "@/types/print"

interface LabelListProps {
  prints: Print[]
  selectedLabel: string | null
  onLabelClick: (label: string | null) => void
}

export function LabelList({ prints, selectedLabel, onLabelClick }: LabelListProps) {
  // すべてのラベルを取得し、使用回数でソート
  const labels = useMemo(() => {
    const labelCount = new Map<string, number>()
    prints.forEach((print) => {
      print.labels.forEach((label) => {
        labelCount.set(label, (labelCount.get(label) || 0) + 1)
      })
    })
    return Array.from(labelCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label]) => label)
  }, [prints])

  if (labels.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 py-2">
      <Badge
        variant={selectedLabel === null ? "default" : "secondary"}
        className="cursor-pointer hover:bg-primary/90"
        onClick={() => onLabelClick(null)}
      >
        すべて
      </Badge>
      {labels.map((label) => (
        <Badge
          key={label}
          variant={selectedLabel === label ? "default" : "secondary"}
          className="cursor-pointer hover:bg-primary/90"
          onClick={() => onLabelClick(label)}
        >
          #{label}
        </Badge>
      ))}
    </div>
  )
} 