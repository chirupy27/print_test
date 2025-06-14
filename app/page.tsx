"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PrintForm } from "@/components/print-form"
import { PrintList } from "@/components/print-list"
import { usePrints } from "@/hooks/usePrints"
import { FileText, Plus, Database } from "lucide-react"
import type { PrintFormData } from "@/types/print"

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const { prints, loading, uploading, addPrint, deletePrint } = usePrints()

  const handleAddPrint = async (formData: PrintFormData) => {
    try {
      await addPrint(formData)
      setShowForm(false)
    } catch (error) {
      console.error("プリントの登録に失敗しました:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">プリント管理</h1>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  ローカル保存
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="mb-8">
            <PrintForm 
              onSubmit={handleAddPrint} 
              uploading={uploading} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">登録済みプリント ({prints.length}件)</h2>
            {prints.length > 0 && <p className="text-sm text-gray-500">データはブラウザに保存されています</p>}
          </div>

          <PrintList prints={prints} loading={loading} onDelete={deletePrint} />
        </div>
      </main>

      {/* 下部中央の丸い+ボタン */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={() => setShowForm(!showForm)}
          className={`w-20 h-20 rounded-full shadow-lg transition-all duration-300 ${
            showForm ? "bg-gray-500 hover:bg-gray-600 rotate-45" : "bg-blue-600 hover:bg-blue-700 hover:scale-110"
          }`}
          size="lg"
        >
          <Plus className="h-10 w-10" />
        </Button>
      </div>
    </div>
  )
}
