export { EngagementType } from '../enums'

export interface Engagement {
  id: string
  fusedImageUrl: string
  type: EngagementType
  userIds: string[]
  date: string
}
