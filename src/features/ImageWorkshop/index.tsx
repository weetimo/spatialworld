import React, { useState } from 'react'
import { garden0, garden1, garden2, garden3 } from '../../assets/sample-photos'
import { Tabs} from '../../components'
import { useGeneratedImageStates } from '../../hooks'
import Header from './Header'
import ImageCarousel from './ImageCarousel'
import Prompt from './Prompt'
import Critique from './Critique/dialog'
import Tools from './Tools'

const ImageWorkshop: React.FC = () => {
   // TEMPORARY TEST DATA
  const sampleImages = [garden0, garden1, garden2, garden3]
  const sampleHistory = { image: garden0, prompt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
  const sampleHistory2 = { image: garden1, prompt: '' }
  const critique = 'Perspective of Elderly: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. || Perspective of Disabled: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. || Perspective of Children: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. || Perspective of Elderly: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  const critique1 = ''

  const { images } = useGeneratedImageStates(sampleImages)

  const [openCritiqueModal, setOpenCritiqueModal] = useState(false)
  
  const handleOpenCritiqueModal = (): void => {
    setOpenCritiqueModal(true)
  }

  const handleCloseCritiqueModal = (): void => {
    setOpenCritiqueModal(false)
  }

  const tabs = [
    { label: 'Input', content: <Prompt history={sampleHistory} /> },
    { label: 'Tools', content: <Tools /> }
  ]

  return (
    <>
      <Header onInfoClick={handleOpenCritiqueModal} critique={critique} />
      <ImageCarousel images={images} />
      <Tabs tabs={tabs} />
      <Critique open={openCritiqueModal} onClose={handleCloseCritiqueModal} critique={critique} />
    </>
  )
}

export default ImageWorkshop
