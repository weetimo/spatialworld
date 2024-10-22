import { ref, set, get, update, remove } from 'firebase/database'
import { database } from '../config/firebase'

export const useDatabase = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createData = async (path: string, data: any) => {
    try {
      await set(ref(database, path), data)
      console.log('Data created successfully at path:', path)
    } catch (error) {
      console.error('Error creating data:', error)
    }
  }

  const readData = async (path: string) => {
    try {
      const snapshot = await get(ref(database, path))
      if (snapshot.exists()) {
        console.log('Data fetched successfully:', snapshot.val())
        return snapshot.val()
      } else {
        console.log('No data available at path:', path)
        return null
      }
    } catch (error) {
      console.error('Error reading data:', error)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData = async (path: string, updatedData: any) => {
    try {
      await update(ref(database, path), updatedData)
      console.log('Data updated successfully at path:', path)
    } catch (error) {
      console.error('Error updating data:', error)
    }
  }

  const deleteData = async (path: string) => {
    try {
      await remove(ref(database, path))
      console.log('Data deleted successfully at path:', path)
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }

  return { createData, readData, updateData, deleteData }
}
