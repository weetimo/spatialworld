import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, TextField, LinearProgress } from '@mui/material'
import { QuestionnaireType } from '../../enums'
import { Questionnaire, Answer } from '../../types'
import CheckIcon from '@mui/icons-material/Check'

const UserPreferences: React.FC = () => {
  const questionnaire: Questionnaire = {
    id: "q1",
    questions: [
      {
        id: "q1-1",
        question: "What interests you most about the redevelopment?",
        choices: ["Heritage", "Sustainability", "Urban Resilience", "Technology", "Greenery"],
        questionnaireId: "q1",
        type: QuestionnaireType.MULTI_ANSWERS,
      },
      {
        id: "q1-2",
        question: "Have you visited this SUTD green space or its surrounding areas before?",
        choices: ["Yes", "No, I don’t have a chance", "I'm not sure", "Where is it?"],
        questionnaireId: "q1",
        type: QuestionnaireType.MULTI_ANSWERS,
      },
      {
        id: "q1-3",
        question: "What are some of the daily issues you face?",
        questionnaireId: "q1",
        type: QuestionnaireType.FREE_RESPONSE,
      },
    ],
  }

  const navigate = useNavigate()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [freeResponse, setFreeResponse] = useState('')

  const currentQuestion = questionnaire.questions?.[currentQuestionIndex]

  const handleSelectChoice = (choice: string) => {
    if (currentQuestion) {
      const existingAnswer = answers.find(a => a.questionId === currentQuestion.id)
      if (existingAnswer) {
        existingAnswer.answer = existingAnswer.answer?.includes(choice)
          ? existingAnswer.answer.filter(ans => ans !== choice)
          : [...existingAnswer.answer, choice]
        setAnswers([...answers])
      } else {
        setAnswers([...answers, { questionId: currentQuestion.id, answer: [choice] }])
      }
    }
  }

  const handleFreeResponseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFreeResponse(event.target.value)
  }

  const handleNext = () => {
    if (currentQuestion) {
      if (currentQuestion.type === QuestionnaireType.FREE_RESPONSE) {
        setAnswers([...answers, { questionId: currentQuestion.id, answer: [freeResponse] }])
        setFreeResponse('')
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmit = () => {
    if (currentQuestion?.type === QuestionnaireType.FREE_RESPONSE && freeResponse) {
      setAnswers([...answers, { questionId: currentQuestion.id, answer: [freeResponse] }])
    }
    navigate('/start-workshop')
  }

  const isLastQuestion = currentQuestionIndex === (questionnaire.questions?.length || 0) - 1

  return (
    <Box sx={styles.container}>
      <LinearProgress
        variant="determinate"
        value={((currentQuestionIndex + 1) / (questionnaire.questions?.length || 1)) * 100}
        sx={styles.progressBar}
      />

      <Typography variant="h5" sx={styles.questionText}>
        {currentQuestion?.question}
      </Typography>

      {currentQuestion?.type === QuestionnaireType.MULTI_ANSWERS && (
        <Box>
          {currentQuestion.choices?.map(choice => {
            const isSelected = answers.find(a => a.questionId === currentQuestion.id)?.answer?.includes(choice)
            return (
              <Button
                key={choice}
                variant="contained"
                onClick={() => handleSelectChoice(choice)}
                sx={{
                  ...styles.choiceButton,
                  ...(isSelected ? styles.choiceButtonSelected : {})
                }}
                endIcon={isSelected ? <CheckIcon sx={styles.checkIcon} /> : null}
              >
                {choice}
              </Button>
            )
          })}
        </Box>
      )}

      {currentQuestion?.type === QuestionnaireType.FREE_RESPONSE && (
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          placeholder="Share your thoughts here..."
          value={freeResponse}
          onChange={handleFreeResponseChange}
          sx={styles.textField}
          InputProps={{
            style: {
              backgroundColor: '#fff',
              borderRadius: '1rem',
            },
          }}
        />
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={isLastQuestion ? handleSubmit : handleNext}
        fullWidth
        sx={styles.nextButton}
      >
        {isLastQuestion ? 'Submit' : 'Next'}
      </Button>
    </Box>
  )
}

const styles = {
  container: {
    padding: '1rem',
    maxWidth: '500px',
    margin: 'auto',
  },
  progressBar: {
    marginBottom: '1rem',
  },
  questionText: {
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
    padding: '1rem',
  },
  choiceButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '1.5rem',
    padding: '1.5rem',
    boxShadow: 'none',
    borderRadius: '12px',
    textAlign: 'left',
    fontSize: '1rem',
    textTransform: 'none', // Prevents uppercase text for choices
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ddd', // To remove the shadow effect
    '&:hover': {
      backgroundColor: '#f0f4ff',
    },
  },
  choiceButtonSelected: {
    backgroundColor: '#e0f0ff',
    borderColor: '#e0f0ff',
    color: '#007bff',
    boxShadow: 'none'
  },
  checkIcon: {
    color: '#007bff',
  },
  textField: {
    marginBottom: '1rem',
    borderRadius: '8px', // Only general styling
  },
  nextButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '1rem',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    textTransform: 'none', // Prevents uppercase text for the Next/Submit button
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
}

export default UserPreferences
