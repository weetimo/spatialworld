import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Paper, Typography, Box, Grid } from '@mui/material'
import { mockData } from './data'

const QnaContent = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Multiple Choice Responses */}
      {mockData.multipleChoice.map((question, index) => (
        <Paper key={index} elevation={3} sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            {question.question}
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={question.responses}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='answer'
                  angle={-0}
                  textAnchor='middle'
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#4f46e5' />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      ))}

      {/* Open Ended Responses */}
      {/* Changed from single object to map through array of open ended questions */}
      {mockData.openEnded.map((openEndedQuestion, questionIndex) => (
        <Box key={questionIndex} sx={{ p: 3 }}>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 500,
              color: '#000',
              mb: 2,
              fontSize: '1.1rem'
            }}
          >
            {openEndedQuestion.question}
          </Typography>
          <Grid container spacing={2}>
            {openEndedQuestion.responses.map((response, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    padding: '24px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    color: '#000',
                    lineHeight: 1.5
                  }}
                >
                  {response}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  )
}

export default QnaContent
