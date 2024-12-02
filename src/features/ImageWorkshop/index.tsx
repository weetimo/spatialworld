// ImageWorkshop.tsx

import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import ImageCarousel from './InpaintingCarousel'
import { Tabs } from '../../components'
import Prompt from './PromptInput'
import InpaintingTools from './InpaintingTools'
import Critique from './Critique/dialog'
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material'
import { useDatabase } from '../../hooks'

// ========================
// Type Definitions
// ========================

// Define the structure for image objects
interface Image {
  src: string
  tags: string[]
}

interface FinalImage {
  src: string
}


// ========================
// ImageWorkshop Component
// ========================

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

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const data = await readData(`engagements/${engagementId}`)
        setEngagementData(data)
      } catch (error) {
        console.error('Error fetching engagement data:', error)
      }
    }

    if (engagementId) {
      fetchEngagement()
    }
  }, [engagementId, stableReadData])

  useEffect(() => {
    if (engagementData) {
      setImages([
        { src: engagementData.imageUrl, tags: [engagementData.imageCaption] }
      ])
    }
  }, [engagementData])

  // ========================
  // State Management
  // ========================
  const [isImageEdited, setIsImageEdited] = useState(false)
  const [maskedImageData, setMaskedImageData] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [promptText, setPromptText] = useState('')
  const [loading, setLoading] = useState(false) // Loading state
  const [editMode, setEditMode] = useState<boolean>(false)

  const [openCritiqueModal, setOpenCritiqueModal] = useState(false)
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

  // ========================
  // Helper Functions
  // ========================

  // Function to preload an image
  const preloadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = url
      img.onload = () => resolve(url)
      img.onerror = reject
    })
  }

  // Function to improve caption via API call
  const improveCaption = async (input: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:8000/improve-caption/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      })

      if (!response.ok) {
        throw new Error('Failed to improve caption')
      }
      const data = await response.json()
      return data.improved_prompt
    } catch (error) {
      console.error('Error improving caption:', error)
      return input
    }
  }

  // ========================
  // Effects
  // ========================

  // Update selected tab based on edit mode
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

  // ========================
  // Event Handlers
  // ========================

  // Handle sending the prompt to generate an image
  const handleProcessPrompt = async () => {
    console.log('handleProcessPrompt invoked')
    setLoading(true)

    const convertToBase64 = async (url: string): Promise<string> => {
      const response = await fetch(url)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    }
  
    if (!maskedImageData && promptText) {
      try {
        console.log('Using img2img endpoint')
        const originalImageResponse = await fetch(images[currentImageIndex].src)
        const originalImageBlob = await originalImageResponse.blob()
        const formData = new FormData()
        formData.append('image', originalImageBlob, 'original.png')
        formData.append('prompt', promptText) 
        const response = await fetch('http://localhost:8000/api/img2img', {
          method: 'POST',
          body: formData
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate image')
        }

        if (data.url) {
          console.log('Generated image URL:', data.url)
          const newImage: Image = { src: data.url, tags: ['Generated'] }
          const newIndex = images.length
          // convert to base64 image
          const base64Image = await convertToBase64(data.url)
          // set final image as state
          setFinalImage({
            src: base64Image,
          })
          
          // set upscaled prompt
          if (data.upscaledPrompt) {
            setUpscaledPrompt(data.upscaledPrompt)
          }
    
          setImages((prevImages) => [...prevImages, newImage])
          setCurrentImageIndex(newIndex)
          setGeneratedImage(data.url)
          setIsGeneratedModalOpen(true)

          // vision
          try {
            const analysisResponse = await fetch('http://localhost:8000/api/analyze-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ image_url: data.url })
            });
            
            if (analysisResponse.ok) {
              const analysisData = await analysisResponse.json();
              setCategory(analysisData.category)
              console.log('Image Category:', analysisData.category);
            }
          } catch (analysisError) {
            console.error('Error analyzing image:', analysisError);
          }
        }
      } catch (error) {
        console.error('Error occurred during img2img:', error)
      } finally {
        setLoading(false)
      }    
    } else if (maskedImageData && promptText) {
      try {
        const improvedPrompt = await improveCaption(promptText)

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

        const originalImageResponse = await fetch(images[currentImageIndex].src)
        const originalImageBlob = await originalImageResponse.blob()
        formData.append('image', originalImageBlob, 'original.png')

        formData.append('prompt', improvedPrompt)
        formData.append('size', '1024x1024')
        console.log('Prompt Text sent:', improvedPrompt)
        console.log('Sending API request with FormData...')

        const response = await fetch('http://localhost:8000/api/edit-image', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          console.log('API call successful!', data)
          const preloadedImageUrl = await preloadImage(data.url)

          setIsImageEdited(false)
          setMaskedImageData(null)
          setPromptText('')
          const newImage: Image = { src: data.url, tags: ['Generated'] }
          const newIndex = images.length
          setImages((prevImages) => [...prevImages, newImage])
          setCurrentImageIndex(newIndex)
          setEditMode(false)

          if (data.url) {
            console.log('Generated image URL:', data.url)
            setGeneratedImage(data.url)
            setIsGeneratedModalOpen(true)

            //VISION
            try {
              const analysisResponse = await fetch('http://localhost:8000/api/analyze-image', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image_url: data.url })
              });
              
              if (analysisResponse.ok) {
                const analysisData = await analysisResponse.json();
                console.log('Image Category:', analysisData.category);
              }
            } catch (analysisError) {
              console.error('Error analyzing image:', analysisError);
            }
          }
        } else {
          const errorData = await response.json()
          console.error('API call failed:', response.status, errorData)
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

  // Handle opening the critique modal
  const handleOpenCritiqueModal = () => setOpenCritiqueModal(true)

  // Handle closing the critique modal
  const handleCloseCritiqueModal = () => setOpenCritiqueModal(false)

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
          category={category}
          // coordinates of that image mask
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
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        {/* Cleaned Code */}
        {/* <InfoCritiqueButton
          onInfoClick={handleOpenCritiqueModal}
          critique={[
            { character: 'Elderly', feedback: 'FEEDBACK' },
            { character: 'Children', feedback: 'FEEDBACK' }
          ]} // SAMPLE DATA
        />

        <Critique
          open={openCritiqueModal}
          onClose={handleCloseCritiqueModal}
          generatedImageUrl={garden0} // SAMPLE DATA
          critique={[
            { character: 'Elderly', feedback: 'FEEDBACK' },
            { character: 'Children', feedback: 'FEEDBACK' }
          ]} // SAMPLE DATA
        /> */}

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
              backdropFilter: 'blur(10px)'
            }
          }}
        >
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px'
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
                  marginBottom: '20px',
                  objectFit: 'cover'
                }}
              />
            )}
            <Typography
              variant='h6'
              fontWeight='bold'
              align='left'
              sx={{ marginBottom: '10px' }}
            >
              Impact
            </Typography>

            <Typography align='left'>{criticText}</Typography>
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
                marginTop: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  // Optional hover effect
                }
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
