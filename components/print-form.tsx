"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { UploadModal } from "@/components/upload-modal"
import type { PrintFormData } from "@/types/print"

interface PrintFormProps {
  onSubmit: (data: PrintFormData) => Promise<void>
  uploading: boolean
  onCancel?: () => void
}

export function PrintForm({ onSubmit, uploading, onCancel }: PrintFormProps) {
  const [formData, setFormData] = useState<PrintFormData>({
    title: "",
    labels: "",
    image: null,
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const handleImageSelect = (file: File) => {
    setError(null)
    setFormData((prev) => ({ ...prev, image: file }))

    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image || !formData.title.trim()) {
      setError("画像とタイトルは必須です")
      return
    }

    try {
      await onSubmit(formData)

      // フォームをリセット
      setFormData({ title: "", labels: "", image: null })
      setPreview(null)
      setError(null)

      // 成功メッセージ（オプション）
      alert("プリントが正常に登録されました！")
    } catch (error) {
      setError("プリントの登録に失敗しました")
    }
  }

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setPreview(null)
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              プリント登録
            </div>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}

            <div>
              <Label htmlFor="image">画像 *</Label>
              <div className="mt-1">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 border-dashed"
                    onClick={() => setShowUploadModal(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500">画像を追加</span>
                      <span className="text-xs text-gray-400">(最大5MB)</span>
                    </div>
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="title">タイトル *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="プリントのタイトルを入力"
                required
              />
            </div>

            <div>
              <Label htmlFor="labels">ラベル</Label>
              <Input
                id="labels"
                value={formData.labels}
                onChange={(e) => setFormData((prev) => ({ ...prev, labels: e.target.value }))}
                placeholder="学校, 4月, 提出物 (カンマ区切り)"
              />
              <p className="text-xs text-gray-500 mt-1">複数のラベルはカンマで区切って入力してください</p>
            </div>

            <Button type="submit" className="w-full" disabled={!formData.image || !formData.title.trim() || uploading}>
              {uploading ? "登録中..." : "登録"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onImageSelect={handleImageSelect}
        />
      )}
    </>
  )
}
