import React from 'react'
import { garden0, garden1, garden2, garden3 } from '../../assets/sample-photos'
import { useGeneratedImageStates } from '../../hooks'
import Header from './Header'
import ImageCarousel from './ImageCarousel'

const ImageWorkshop: React.FC = () => {
  const sampleImages = [garden0, garden1, garden2, garden3] // TEMPORARY TEST DATA
  
  const { images } = useGeneratedImageStates(sampleImages)

  return (
    <>
      <Header />
      <ImageCarousel images={images} />
    </>
  )
}

export default ImageWorkshop
