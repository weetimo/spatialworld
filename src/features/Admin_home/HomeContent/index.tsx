import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import { Download, Settings } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import ReactWordcloud from 'react-d3-cloud'

import { regionData, demographicsData, participantsData } from './data'
import { exportToCSV } from './utils'
import baseImage from './images/base_inpaint.jpg'
import heatmapImage from './images/heatmap_inpaint.jpg'
import communityImage from './images/community_image.jpg'
// import wordCloudImage from './images/word_cloud.jpg'

const HomeContent = () => {
  const wordCloudData = [
    { text: 'Sustainability', value: 60 },
    { text: 'Infrastructure', value: 55 },
    { text: 'Housing', value: 50 },
    { text: 'Development', value: 50 },
    { text: 'Space', value: 45 },
    { text: 'Pedestrian', value: 45 },
    { text: 'Green', value: 40 },
    { text: 'Accessibility', value: 40 },
    { text: 'Public', value: 35 }
  ]
  const [openWordCloudSettings, setOpenWordCloudSettings] = useState(false)
  const [wordCloudGender, setWordCloudGender] = useState('male')
  const [wordCloudAge, setWordCloudAge] = useState([20, 35])
  const [showHeatMap, setShowHeatMap] = useState(false)
  const [showGeneratedImage, setShowGeneratedImage] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState([20, 35])
  const handleGenderChange = (
    _event: React.MouseEvent<HTMLElement>,
    newGender: string | null
  ) => {
    if (newGender !== null) {
      setGender(newGender)
    }
  }
  const handleAgeChange = (_event: Event, newValue: number | number[]) => {
    setAge(newValue as number[])
  }

  const handleWordCloudGenderChange = (
    _event: React.MouseEvent<HTMLElement>,
    newGender: string | null
  ) => {
    if (newGender !== null) {
      setWordCloudGender(newGender)
    }
  }

  const handleWordCloudAgeChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    setWordCloudAge(newValue as number[])
  }

  // Settings Dialog Component
  const SettingsDialog = () => (
    <Dialog
      open={openSettings}
      onClose={() => setOpenSettings(false)}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          width: '400px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>Gender</Typography>
          <ToggleButtonGroup
            value={gender}
            exclusive
            onChange={handleGenderChange}
            aria-label='gender selection'
            sx={{ width: '100%' }}
          >
            <ToggleButton
              value='male'
              aria-label='male'
              sx={{
                flex: 1,
                borderRadius: '20px',
                '&.Mui-selected': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              Male
            </ToggleButton>
            <ToggleButton
              value='female'
              aria-label='female'
              sx={{
                flex: 1,
                borderRadius: '20px',
                '&.Mui-selected': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              Female
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>Age</Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={age}
              onChange={handleAgeChange}
              valueLabelDisplay='on'
              min={0}
              max={100}
              sx={{
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                  border: '2px solid #9ca3af'
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#9ca3af'
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#e5e7eb'
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={() => setOpenSettings(false)}
          variant='contained'
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            backgroundColor: 'black',
            '&:hover': {
              backgroundColor: '#374151'
            }
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )

  // Word Cloud Settings Dialog Component
  const WordCloudSettingsDialog = () => (
    <Dialog
      open={openWordCloudSettings}
      onClose={() => setOpenWordCloudSettings(false)}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          width: '400px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>Gender</Typography>
          <ToggleButtonGroup
            value={wordCloudGender}
            exclusive
            onChange={handleWordCloudGenderChange}
            aria-label='gender selection'
            sx={{ width: '100%' }}
          >
            <ToggleButton
              value='male'
              aria-label='male'
              sx={{
                flex: 1,
                borderRadius: '20px',
                '&.Mui-selected': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              Male
            </ToggleButton>
            <ToggleButton
              value='female'
              aria-label='female'
              sx={{
                flex: 1,
                borderRadius: '20px',
                '&.Mui-selected': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              Female
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>Age</Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={wordCloudAge}
              onChange={handleWordCloudAgeChange}
              valueLabelDisplay='on'
              min={0}
              max={100}
              sx={{
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                  border: '2px solid #9ca3af'
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#9ca3af'
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#e5e7eb'
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={() => setOpenWordCloudSettings(false)}
          variant='contained'
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            backgroundColor: 'black',
            '&:hover': {
              backgroundColor: '#374151'
            }
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box>
      {/* Demographics Section */}
      <Typography
        variant='h6'
        sx={{ mb: 2, fontWeight: 500, fontSize: '1.1rem', color: '#6B7280' }}
      >
        Demographics
      </Typography>
      <Typography
        variant='h6'
        sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
      >
        Age & Gender
      </Typography>
      <Box
        sx={{
          height: '400px',
          backgroundColor: 'white',
          p: 2,
          borderRadius: '8px'
          // boxShadow: '0 2px 3px rgba(0,0,0,0.1)'
        }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            layout='vertical'
            data={demographicsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type='number' />
            <YAxis dataKey='age' type='category' />
            <Tooltip
              cursor={false}
              content={({ payload }) => {
                if (!payload || !payload.length) return null

                const colors = {
                  Male: '#ef4444',
                  Female: '#f97316'
                }

                return (
                  <div
                    style={{
                      backgroundColor: 'white',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  >
                    {payload.map((item) => (
                      <div
                        key={item.name}
                        style={{
                          color: colors[item.name as keyof typeof colors]
                        }}
                      >
                        {item.name}: {item.value}
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <Legend />
            <Bar
              dataKey='male'
              name='Male'
              fill='#ef4444'
              stackId='stack'
              barSize={30}
            />
            <Bar
              dataKey='female'
              name='Female'
              fill='#f97316'
              stackId='stack'
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Location and Participants side by side */}
      <Box sx={{ display: 'flex', gap: 4, mt: 6 }}>
        {/* Location Section */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='h6'
            sx={{
              mb: 2,
              fontWeight: 500,
              fontSize: '1.1rem',
              color: '#6B7280'
            }}
          >
            Location
          </Typography>
          <Typography
            variant='h6'
            sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
          >
            Regions
          </Typography>

          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Pie Chart */}
            <Box sx={{ width: '300px', height: '300px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={regionData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={100}
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Legend */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                justifyContent: 'center'
              }}
            >
              {regionData.map((region) => (
                <Box
                  key={region.name}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: region.color
                    }}
                  />
                  <Typography>{region.name}</Typography>
                  <Typography sx={{ color: '#6B7280' }}>
                    {region.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Participants List Section */}
        <Box sx={{ flex: 1 }}>
          {/* Headers first */}
          <Typography
            variant='h6'
            sx={{
              mb: 2,
              fontWeight: 500,
              fontSize: '1.1rem',
              color: '#6B7280'
            }}
          >
            Participants
          </Typography>
          <Typography
            variant='h6'
            sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
          >
            Participants List
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end', // Changed to align button to right
              mb: 3
            }}
          >
            <Button
              onClick={() => exportToCSV(participantsData)}
              startIcon={<Download size={18} />}
              variant='outlined'
              sx={{ borderRadius: '8px' }}
            >
              Export to CSV
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              boxShadow: '0 2px 3px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              height: '300px', // Match height with pie chart
              overflow: 'auto'
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participantsData.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      {/* New Image Section */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant='h6'
          sx={{ mb: 2, fontWeight: 500, fontSize: '1.1rem', color: '#6B7280' }}
        >
          In-painting
        </Typography>
        <Typography
          variant='h6'
          sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
        >
          Image
        </Typography>
        {/* Image Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          {/* Base Image */}
          <img
            src={baseImage}
            alt='Base area'
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              display: 'block'
            }}
          />

          {/* Heat Map Overlay - Only shown when showHeatMap is true */}
          {showHeatMap && (
            <img
              src={heatmapImage}
              alt='Heat map overlay'
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.7,
                borderRadius: '8px'
              }}
            />
          )}
        </Box>
        {/* Toggle Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant='outlined'
            onClick={() => setShowHeatMap(!showHeatMap)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '150px'
            }}
          >
            Overlay Heat-map
          </Button>
        </Box>
      </Box>
      {/* Community Generation Section */}
      <Box sx={{ mt: 6 }}>
        {/* Header with Settings */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography
              variant='h6'
              sx={{
                mb: 2,
                fontWeight: 500,
                fontSize: '1.1rem',
                color: '#6B7280'
              }}
            >
              Community Generation
            </Typography>
            <Typography
              variant='h6'
              sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
            >
              Image
            </Typography>
          </Box>
          <Button
            startIcon={<Settings size={24} />}
            variant='text'
            onClick={() => setOpenSettings(true)}
            sx={{
              color: '#6B7280',
              minWidth: 'unset',
              p: 1
            }}
          ></Button>
        </Box>

        {/* Image Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          {/* Show image only when generated */}
          {showGeneratedImage ? (
            <img
              src={communityImage}
              alt='Generated community'
              style={{
                width: '100%',
                aspectRatio: '16/9', // Maintains consistent height ratio
                // height: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                aspectRatio: '16/9', // Maintains consistent height ratio
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
              }}
            >
              <Typography sx={{ color: '#6B7280', mb: 2 }}>
                Community Image Here
              </Typography>
            </Box>
          )}
        </Box>

        {/* Generate Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant='contained'
            onClick={() => setShowGeneratedImage(true)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '150px',
              backgroundColor: 'white',
              color: 'black',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#f3f4f6'
              }
            }}
          >
            Generate Image
          </Button>
        </Box>
      </Box>
      <SettingsDialog />
      {/* Word Cloud Section */}
      <Box sx={{ mt: 6 }}>
        {/* Header with Settings */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography
              variant='h6'
              sx={{
                mb: 2,
                fontWeight: 500,
                fontSize: '1.1rem',
                color: '#6B7280'
              }}
            >
              Word-cloud
            </Typography>
            <Typography
              variant='h6'
              sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
            >
              Most Popular Topics
            </Typography>
          </Box>
          <Button
            startIcon={<Settings size={24} />}
            variant='text'
            onClick={() => setOpenWordCloudSettings(true)}
            sx={{
              color: '#6B7280',
              minWidth: 'unset',
              p: 1
            }}
          />
        </Box>

        {/* Word Cloud Container */}
        {/* Word Cloud Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '400px',
            borderRadius: '8px',
            backgroundColor: 'white',
            p: 2
          }}
        >
          <ReactWordcloud
            data={wordCloudData}
            fontSize={(word) => Math.log2(word.value) * 4} // Adjusted multiplier
            font='impact'
            rotate={0} // No rotation for cleaner look
            padding={10} // Increased padding between words
            width={1200} // Increased width
            height={350} // Adjusted height
            spiral='archimedean' // Changed spiral type
            fill={(_word: any, index: number) =>
              ['#0d47a1', '#2e7d32', '#ef4444', '#f97316'][index % 4]
            }
          />
        </Box>
      </Box>
      <WordCloudSettingsDialog />
    </Box>
  )
}

export default HomeContent
