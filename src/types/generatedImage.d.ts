export interface GeneratedImage {
  id: string
  description: string
  engagementId: string
  imageUrl: string
  votes: number
  voters: string[] // userIds
}
