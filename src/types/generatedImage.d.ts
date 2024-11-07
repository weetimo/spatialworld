export interface GeneratedImage {
  id: string
  originalPrompt: string
  engagementId: string
  imageUrl: string
  voters: string[] // userIds
  upscaledPrompt: string
  userId: string
  createdAt: string
}
