import type { Print } from "@/types/print"

const STORAGE_KEY = "prints_data"

export const localStorageUtils = {
  // プリント一覧を取得
  getPrints: (): Print[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []

      const prints = JSON.parse(data)
      // 日付文字列をDateオブジェクトに変換
      return prints.map((print: any) => ({
        ...print,
        createdAt: new Date(print.createdAt),
      }))
    } catch (error) {
      console.error("Error loading prints from localStorage:", error)
      return []
    }
  },

  // プリントを保存
  savePrints: (prints: Print[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prints))
    } catch (error) {
      console.error("Error saving prints to localStorage:", error)
    }
  },

  // 新しいプリントを追加
  addPrint: (print: Omit<Print, "id">): Print => {
    const prints = localStorageUtils.getPrints()
    const newPrint: Print = {
      ...print,
      id: Date.now().toString(),
    }

    const updatedPrints = [newPrint, ...prints]
    localStorageUtils.savePrints(updatedPrints)

    return newPrint
  },

  // プリントを削除
  deletePrint: (id: string): void => {
    const prints = localStorageUtils.getPrints()
    const filteredPrints = prints.filter((print) => print.id !== id)
    localStorageUtils.savePrints(filteredPrints)
  },
}

// 画像ファイルをBase64に変換
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
