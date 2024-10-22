import React from 'react'
import { garden0, garden1, garden2, garden3 } from '../../assets/sample-photos'
import { Tabs } from '../../components'
import { useGeneratedImageStates } from '../../hooks'
import Header from './Header'
import ImageCarousel from './ImageCarousel'
import Prompt from './Prompt'

const ImageWorkshop: React.FC = () => {
   // TEMPORARY TEST DATA
  const sampleImages = [garden0, garden1, garden2, garden3]
  const sampleHistory = { image: garden0, prompt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
  const sampleHistory2 = { image: garden1, prompt: '' }

  const { images } = useGeneratedImageStates(sampleImages)

  const tabs = [
    { label: 'Input', content: <Prompt history={sampleHistory2} disabled={sampleHistory2?.prompt?.trim() !== ''} /> },
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
