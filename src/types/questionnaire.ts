import { QuestionnaireType } from '../enums'

export interface Questionnaire {
  id: string
  answers?: string[]
  question: string
  type: QuestionnaireType
}
