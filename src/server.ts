import express from 'express' 
import cors from 'cors'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'
import dotenv from 'dotenv'

dotenv.config()

connectDB()

const app = express()

// Cors
app.use(cors(corsConfig))

// Leer datos de formularios
app.use(express.json())

app.use('/', router)

export default app