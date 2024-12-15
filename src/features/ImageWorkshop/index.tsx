import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import ImageCarousel from './InpaintingCarousel'
import { Tabs } from '../../components'
import Prompt from './PromptInput'
import InpaintingTools from './InpaintingTools'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  CircularProgress
} from '@mui/material'
import { useDatabase } from '../../hooks'
import { getApiUrl } from '../../config/api'

// Type Definitions
// Define the structure for image objects
interface Image {
  src: string
  tags: string[]
}

interface FinalImage {
  src: string
}

// ImageWorkshop Component
const ImageWorkshop: React.FC = () => {
  const { id } = useParams()
  const engagementId = id

  const { readData } = useDatabase()

  const [engagementData, setEngagementData] = useState<any>(null)
  const [images, setImages] = useState<Image[]>([
    { src: engagementData?.imageUrl, tags: [engagementData?.imageCaption] }
  ])
  const [category, setCategory] = useState<string>('')

  const stableReadData = useCallback(readData, [])

  const proxyImageUrl = (url: string) => {
    console.log('reached proxy function')
    console.log('url:', url)

    if (url.includes('cloudflarestorage.com')) {
      return `${getApiUrl('proxy-image')}?url=${encodeURIComponent(url)}`;
    }
    return url
  }

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const data = await readData(`engagements/${engagementId}`);
        setEngagementData(data);
        if (data?.imageUrl) {
          setImages([{ 
            src: data.imageUrl, 
            tags: [data?.imageCaption] 
          }]);
        }
      } catch (error) {
        console.error('Error fetching engagement data:', error);
      }
    };

    if (engagementId) {
      fetchEngagement();
    }
  }, [engagementId, stableReadData])

  useEffect(() => {
    if (engagementData) {
      setImages([
        { src: engagementData.imageUrl, tags: [engagementData.imageCaption] }
      ])
    }
  }, [engagementData])

  // State Management
  const [isImageEdited, setIsImageEdited] = useState(false)
  const [maskedImageData, setMaskedImageData] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [promptText, setPromptText] = useState('')
  const [loading, setLoading] = useState(false) // Loading state
  const [editMode, setEditMode] = useState<boolean>(false)

  const [isGeneratedModalOpen, setIsGeneratedModalOpen] =
    useState<boolean>(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [criticText, setCriticText] = useState<string>(
    'Please note that this image was generated by artificial intelligence and is not a representation of real-life events, people, or places. It is intended solely for illustrative purposes and to showcase the creative capabilities of AI.'
  )

  const [finalImage, setFinalImage] = useState<FinalImage | null>(null)
  const [upscaledPrompt, setUpscaledPrompt] = useState<string>('')

  // Brush Size
  const [brushSize, setBrushSize] = useState<number>(50)
  const [selectedTab, setSelectedTab] = useState(0)
  const [impactLoading, setImpactLoading] = useState(false)
  const [allCoordinates, setAllCoordinates] = useState([])

  // Function to improve caption via API call
  const improveCaption = async (input: string, mode: string): Promise<string> => {
    try {
      const response = await fetch(getApiUrl('improve-caption/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, mode }) 
      });
  
      if (!response.ok) {
        throw new Error('Failed to improve caption');
      }
      const data = await response.json();
      return data.improved_prompt;
    } catch (error) {
      console.error('Error improving caption:', error);
      return input;
    }
  };
  
  // Effects
  useEffect(() => {
    if (editMode) {
      setSelectedTab(1)
    } else {
      setSelectedTab(0)
    }
  }, [editMode])

  // Load images from localStorage on mount
  useEffect(() => {
    const savedImages = localStorage.getItem('images')
    if (savedImages) {
      setImages(JSON.parse(savedImages))
    }
  }, [])

  // Save images to localStorage whenever images state changes
  useEffect(() => {
    localStorage.setItem('images', JSON.stringify(images))
  }, [images])

  // Event Handlers
  // Handle passing the final generated image as a file
  const convertToBase64 = async (url: string): Promise<string> => {
    console.log('Converting to base64:', url)
    const response = await fetch(url, { mode: 'no-cors', headers: { 'Access-Control-Allow-Origin': '*' } })
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Handle sending the prompt to generate an image
  const handleProcessPrompt = async () => {
    console.log('handleProcessPrompt invoked')
    setLoading(true)

    const callImpactAPI = async (imageUrl: string) => {
      setImpactLoading(true)
      try {
        const response = await fetch(getApiUrl('api/character-impact'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image_url: imageUrl
          })
        })

        if (!response.ok) {
          throw new Error('Failed to analyze image impact')
        }

        const data = await response.json()
        console.log('Impact API response:', data)

        if (data.analysis) {
          const formattedImpactText = Object.entries(data.analysis)
            .map(([character, impact]) => {
              return `**${character}**\n${impact}`
            })
            .join('\n\n')

          setCriticText(formattedImpactText)
          setIsGeneratedModalOpen(true) 
        }
      } catch (error) {
        console.error('Error calling impact API:', error)
        setCriticText('Error analyzing image impact. Please try again.')
        setIsGeneratedModalOpen(true) 
      } finally {
        setImpactLoading(false)
      }
    }

    if (!maskedImageData && promptText) {
      try {
        console.log('Using img2img endpoint')
        // console.log('images', images)
        const improvedPrompt = await improveCaption(promptText, "img2img");
        setUpscaledPrompt(improvedPrompt)
        console.log('Original Image Response')
        const originalImageResponse = await fetch(images[currentImageIndex].src, { mode: 'no-cors', headers: { 'Access-Control-Allow-Origin': '*' } })
        const originalImageBlob = await originalImageResponse.blob()
        console.log('Original Image Response Blob')
        const formData = new FormData()
        console.log('Upscaled prompt:', improvedPrompt)
        formData.append('image', originalImageBlob, 'original.png')
        formData.append('prompt', improvedPrompt)
        const response = await fetch(getApiUrl('api/img2img'), {
          method: 'POST',
          body: formData
        })

        const data = await response.json()

        if (!response.ok) {
          console.log('images', images)
          throw new Error(data.error || 'Failed to generate image')
        }

        if (data.url) {
          console.log('Generated image URL:', data.url)
          const newImage: Image = { src: data.url, tags: ['Generated'] }
          const newIndex = images.length
          // convert to base64 image
          console.log('Converting to base64...')
          const base64Image = await convertToBase64(data.url)
          console.log('Converted to base64!')
          setFinalImage({ src: base64Image })
          setImages((prevImages) => [...prevImages, newImage])
          setCurrentImageIndex(newIndex)
          setGeneratedImage(data.url)
          setIsGeneratedModalOpen(true)
          console.log('Getting character impact...')
          callImpactAPI(data.url)

          // vision. I think this is whats causing the CORS error
          try {
            const analysisResponse = await fetch(getApiUrl('api/analyze-image'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ image_url: data.url })
            })

            if (analysisResponse.ok) {
              const analysisData = await analysisResponse.json()
              setCategory(analysisData.category)
              console.log('Image Category:', analysisData.category)
            }
          } catch (analysisError) {
            console.error('Error analyzing image:', analysisError)
          }
        }
      } catch (error) {
        console.error('Error occurred during img2img:', error)
      } finally {
        setLoading(false)
      }
    } else if (maskedImageData && promptText) {
      try {
        const improvedPrompt = await improveCaption(promptText, "inpainting");
        setUpscaledPrompt(improvedPrompt)
        console.log('Initiating API call...')
        console.log('Current Masked Image Data:', maskedImageData)
        console.log('Current Original Image:', images[currentImageIndex].src)
        console.log('Improved Prompt Text:', improvedPrompt)

        const formData = new FormData()
        const maskBase64 = maskedImageData.split(',')[1]
        const maskBlob = await fetch(
          `data:image/png;base64,${maskBase64}`
        ).then((r) => r.blob())
        formData.append('mask', maskBlob, 'mask.png')
        console.log('Original Image response')
        const originalImageResponse = await fetch(images[currentImageIndex].src)
        const originalImageBlob = await originalImageResponse.blob()
        console.log('Original Image Blob Created')
        console.log('Original image size:', originalImageBlob.size, 'bytes')
        formData.append('image', originalImageBlob, 'original.png')

        formData.append('prompt', improvedPrompt)
        formData.append('size', '1024x1024')
        console.log('Prompt Text sent:', improvedPrompt)
        console.log('FormData contents:', Array.from(formData.entries()).map(([key, value]) => `${key}: ${value instanceof Blob ? value.size + ' bytes' : value}`))
        console.log('Sending API request with FormData...')

        const response = await fetch(getApiUrl('api/edit-image'), {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.text()
          console.error('API Error:', response.status, errorData)
          throw new Error(`API call failed: ${response.status} ${errorData}`)
        }

        const data = await response.json()
        console.log('API call successful!', data)
        setIsImageEdited(false)
        setMaskedImageData(null)
        const newImage: Image = { src: data.url, tags: ['Generated'] }
        const newIndex = images.length
        setImages((prevImages) => [...prevImages, newImage])
        setCurrentImageIndex(newIndex)
        setEditMode(false)

        if (data.url) {
          console.log('Generated image URL:', data.url)
          setGeneratedImage(data.url)
          setIsGeneratedModalOpen(true)
          await callImpactAPI(data.url)
          const base64Image = await convertToBase64(data.url)
          setFinalImage({ src: base64Image })

          //VISION
          try {
            const analysisResponse = await fetch(getApiUrl('api/analyze-image'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ image_url: data.url })
            })

            if (analysisResponse.ok) {
              const analysisData = await analysisResponse.json()
              console.log('Image Category:', analysisData.category)
              setCategory(analysisData.category)
            }
          } catch (analysisError) {
            console.error('Error analyzing image:', analysisError)
          }
        }
      } catch (error) {
        console.error('Error occurred during API call:', error)
      } finally {
        setLoading(false)
      }
    } else {
      console.warn('Image or prompt missing!')
      setLoading(false)
    }
  }

  const handleRedoInpainting = () => {
    // Add your redo inpainting logic here
  }

  const handleUndoInpainting = () => {
    // Add your undo inpainting logic here
  }

  // ========================
  // Tabs Configuration
  // ========================

  const tabs = [
    {
      label: 'Input',
      content: (
        <Prompt
          engagementId={engagementId}
          previousPrompt={'This is a test previous prompt.'}
          promptText={promptText}
          setPromptText={setPromptText}
          isImageEdited={isImageEdited}
          handleProcessPrompt={handleProcessPrompt}
          loading={loading}
          finalImage={finalImage}
          upscaledPrompt={upscaledPrompt}
          category = {category}
          coordinates={allCoordinates}
          // TODO: ADD COORDINATES
        />
      )
    },
    {
      label: 'Tools',
      content: (
        <InpaintingTools
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          handleRedo={handleRedoInpainting}
          handleUndo={handleUndoInpainting}
        />
      )
    }
  ]

  // ========================
  // Render
  // ========================

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Image Carousel */}
        <ImageCarousel
          images={images}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
          editMode={editMode}
          setEditMode={setEditMode}
          setIsImageEdited={setIsImageEdited}
          setMaskedImageData={setMaskedImageData}
          brushSize={brushSize}
          loading={loading} // Pass loading prop
          allCoordinates={allCoordinates}
          setAllCoordinates={setAllCoordinates}
        />

        {/* Tabs Section */}
        <Box
          sx={{
            padding: '18px 18px 0px 18px'
          }}
        >
          <Tabs
            tabs={tabs}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
        </Box>

        {/* Generated Image Modal */}
        <Dialog
          open={isGeneratedModalOpen}
          onClose={() => setIsGeneratedModalOpen(false)}
          maxWidth='md'
          fullWidth
          aria-labelledby='generated-image-dialog'
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              height: '65vh'
            }
          }}
        >
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              gap: 2
            }}
          >
            {generatedImage && (
              <img
                src={generatedImage}
                alt='Generated'
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  objectFit: 'cover'
                }}
              />
            )}

            {impactLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  padding: 3
                }}
              >
                <CircularProgress size={20} />
                <Typography>Analyzing impact...</Typography>
              </Box>
            ) : (
              <Box sx={{ whiteSpace: 'pre-line' }}>
                {criticText.split('\n').map((line, index) => (
                  <Typography
                    key={index}
                    align='left'
                    sx={{
                      marginBottom: 1,
                      ...(line.startsWith('**') && line.endsWith('**')
                        ? {
                            fontWeight: 'bold'
                          }
                        : {})
                    }}
                  >
                    {line.replace(/\*\*/g, '')}
                  </Typography>
                ))}
              </Box>
            )}

            <Button
              variant='contained'
              onClick={() => {
                setIsGeneratedModalOpen(false)
              }}
              fullWidth
              sx={{
                backgroundColor: '#007bff',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 0',
                textTransform: 'none',
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              Acknowledged
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  )
}

export default ImageWorkshop
