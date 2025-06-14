export interface Print {
  id: string
  imageUrl: string
  title: string
  labels: string[]
  createdAt: Date
}

export interface PrintFormData {
  title: string
  labels: string
  image: File | null
}
