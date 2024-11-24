import axios from 'axios'

const useCloudinary = () => {
  const uploadImage = async (imageFile: File): Promise<string> => {
    try {
      const cloudName = 'dgfvymgcc'
      const uploadPreset = 'preset'

      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('upload_preset', uploadPreset)

      console.log('Uploading to Cloudinary:', {
        fileName: imageFile.name,
        preset: uploadPreset,
        cloudName,
      })

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      )

      console.log('Cloudinary Response:', response.data)
      return response.data.secure_url
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error)
      throw error
    }
  }

  return { uploadImage }
}

export default useCloudinary
