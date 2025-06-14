"use client"

import { useState, useEffect } from "react"
import { localStorageUtils, convertImageToBase64 } from "@/lib/storage"
import type { Print, PrintFormData } from "@/types/print"

export function usePrints() {
  const [prints, setPrints] = useState<Print[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // ローカルストレージからプリントを読み込み
  const fetchPrints = () => {
    try {
      const storedPrints = localStorageUtils.getPrints()
      setPrints(storedPrints)
    } catch (error) {
      console.error("Error fetching prints:", error)
      setPrints([])
    } finally {
      setLoading(false)
    }
  }

  // 新しいプリントを追加
  const addPrint = async (formData: PrintFormData) => {
    if (!formData.image) return

    setUploading(true)
    try {
      // 画像をBase64に変換
      const imageBase64 = await convertImageToBase64(formData.image)

      // プリントデータを作成
      const printData = {
        imageUrl: imageBase64,
        title: formData.title,
        labels: formData.labels
          .split(",")
          .map((label) => label.trim())
          .filter((label) => label),
        createdAt: new Date(),
      }

      // ローカルストレージに保存
      const newPrint = localStorageUtils.addPrint(printData)

      // 状態を更新
      setPrints((prev) => [newPrint, ...prev])
    } catch (error) {
      console.error("Error adding print:", error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  // プリントを削除
  const deletePrint = (id: string) => {
    try {
      localStorageUtils.deletePrint(id)
      setPrints((prev) => prev.filter((print) => print.id !== id))
    } catch (error) {
      console.error("Error deleting print:", error)
    }
  }

  useEffect(() => {
    fetchPrints()
  }, [])

  return {
    prints,
    loading,
    uploading,
    addPrint,
    deletePrint,
    refetch: fetchPrints,
  }
}
