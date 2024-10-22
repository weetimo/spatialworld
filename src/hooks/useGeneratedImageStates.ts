import { useState } from 'react'

const useGeneratedImageStates = (initialImages: string[]) => {
  const [images, setImages] = useState<string[]>(initialImages)

  const addImage = (newImage: string) => {
    setImages((prevImages) => [...prevImages, newImage])
  }

  const editImage = (index: number, updatedImage: string) => {
    setImages((prevImages) =>
      prevImages.map((img, i) => (i === index ? updatedImage : img))
    )
  }

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  return {
    images,
    addImage,
    editImage,
    removeImage
  }
}

export default useGeneratedImageStates
