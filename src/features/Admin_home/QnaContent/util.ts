const aggregateMultipleChoice = (users: any[], questions: any[]): any[] => {
  const multipleChoiceData: any[] = []

  const questionMap: Record<string, { question: string; choices: string[] }> = {}
  questions.forEach((question: any) => {
    if (question.type === 'MULTI_ANSWERS') {
      questionMap[question.id] = {
        question: question.question,
        choices: question.choices || []
      }
    }
  })

  const answerCounts: Record<string, Record<string, number>> = {}
  Object.entries(questionMap).forEach(([questionId, details]) => {
    answerCounts[questionId] = details.choices.reduce(
      (acc: Record<string, number>, choice: string) => {
        acc[choice] = 0
        return acc
      },
      {}
    )
  })

  users?.forEach((user) => {
    user.preferences?.answers?.forEach((answer: any) => {
      const questionId = answer.questionId

      if (questionMap[questionId]) {
        answer.answer.forEach((response: string) => {
          if (answerCounts[questionId][response] !== undefined) {
            answerCounts[questionId][response] += 1
          }
        })
      }
    })
  })

  Object.entries(answerCounts).forEach(([questionId, responses]) => {
    const { question } = questionMap[questionId]
    multipleChoiceData.push({
      question,
      responses: Object.entries(responses).map(([answer, count]) => ({
        answer,
        count
      }))
    })
  })

  return multipleChoiceData
}

const apiProcessResponses = async (responses: string[]): Promise<any[]> => {
  const apiUrl = "/api/categorize-responses" 

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ responses })
  })

  if (!response.ok) {
    throw new Error(`Failed to process responses: ${response.statusText}`)
  }

  const jsonResponse = await response.json()

  return jsonResponse?.categories
}


const aggregateOpenEnded = async (users: any[], questions: any): any[] => {
  const openEndedData: any[] = []

  const questionMap: Record<string, string> = {}
  questions.forEach((question: any) => {
    if (question.type === 'FREE_RESPONSE') {
      questionMap[question.id] = question.question
    }
  })

  const answersByQuestion: Record<string, string[]> = {}
  users?.forEach((user) => {
    user.preferences?.answers?.forEach((answer: any) => {
      const questionId = answer.questionId
      if (questionMap[questionId]) {
        if (!answersByQuestion[questionId]) {
          answersByQuestion[questionId] = []
        }
        answersByQuestion[questionId].push(...answer.answer)
      }
    })
  })

  for (const [questionId, responses] of Object.entries(answersByQuestion)) {
    const categorizedResponses = await apiProcessResponses(responses)

    openEndedData.push({
      question: questionMap[questionId],
      categories: categorizedResponses
    })
  }

  return openEndedData
}

export const getTopicsForQuestion = (question: any): string[] => {
  const topics = new Set<string>()
  question.categories.forEach((category) => {
    topics.add(category.topic)
  })
  return ['All', ...Array.from(topics)]
}

export const generateData = (users: any[], questions: any): any => {
  return {
    multipleChoice: aggregateMultipleChoice(users, questions),
    openEnded: aggregateOpenEnded(users, questions)
  }
}
