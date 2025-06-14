"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2, FileText } from "lucide-react"
import { LabelList } from "@/components/label-list"
import type { Print } from "@/types/print"

interface PrintListProps {
  prints: Print[]
  loading: boolean
  onDelete?: (id: string) => void
}

export function PrintList({ prints, loading, onDelete }: PrintListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

  const filteredPrints = useMemo(() => {
    return prints.filter((print) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === "" || 
        print.title.toLowerCase().includes(searchLower) ||
        print.labels.some((label) => label.toLowerCase().includes(searchLower))
      
      const matchesLabel = selectedLabel === null || 
        print.labels.includes(selectedLabel)

      return matchesSearch && matchesLabel
    })
  }, [prints, searchTerm, selectedLabel])

  const handleDelete = (id: string, title: string) => {
    if (confirm(`「${title}」を削除しますか？`)) {
      onDelete?.(id)
    }
  }

  const handleLabelClick = (label: string | null) => {
    setSelectedLabel(label)
    // ラベルをクリックしたときに検索バーをクリア
    setSearchTerm("")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="タイトルやラベルで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <LabelList
          prints={prints}
          selectedLabel={selectedLabel}
          onLabelClick={handleLabelClick}
        />
      </div>

      {filteredPrints.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm || selectedLabel ? "検索結果が見つかりません" : "プリントが登録されていません"}
          </p>
          {!searchTerm && !selectedLabel && (
            <p className="text-gray-400 text-sm mt-2">「新規登録」ボタンから最初のプリントを追加してみましょう</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrints.map((print) => (
            <Card key={print.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={print.imageUrl || "/placeholder.svg"}
                  alt={print.title}
                  className="w-full h-full object-cover"
                />
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(print.id, print.title)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{print.title}</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {print.labels.map((label, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleLabelClick(label)}
                    >
                      #{label}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{print.createdAt.toLocaleDateString("ja-JP")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
