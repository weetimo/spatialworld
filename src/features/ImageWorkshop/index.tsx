import React from 'react'
import { garden0, garden1, garden2, garden3 } from '../../assets/sample-photos'
import { Tabs } from '../../components'
import { useGeneratedImageStates } from '../../hooks'
import Header from './Header'
import ImageCarousel from './ImageCarousel'

const ImageWorkshop: React.FC = () => {
  const sampleImages = [garden0, garden1, garden2, garden3] // TEMPORARY TEST DATA
  
  const { images } = useGeneratedImageStates(sampleImages)

  const tabs = [
    { label: 'Input', content: <div>Input Content</div> },
    { label: 'Tools', content: <div>Tools Content</div> },
    { label: 'Critique', content: <div>Critique Content</div> },
  ]

  return (
    <>
      <Header />

      <ImageCarousel images={images} />

      <Tabs tabs={tabs} />
    </>
  )
}

export default ImageWorkshop
