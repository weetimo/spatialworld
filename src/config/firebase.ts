import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBF6BDefsC6zmhnuRmk04l_AHCPbp5fqn8",
  authDomain: "spatial-world.firebaseapp.com",
  databaseURL: "https://spatial-world-default-rtdb.firebaseio.com",
  projectId: "spatial-world",
  storageBucket: "spatial-world.firebasestorage.app",
  messagingSenderId: "558541049241",
  appId: "1:558541049241:web:b7a35d3b634472814b9708"
}

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)
