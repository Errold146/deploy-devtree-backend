import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './router.ts'
import { connectDB, corsConfig } from './config/index.ts'

// Create app
const app = express()

// Cors
app.use( cors(corsConfig))

// Connect to db
connectDB()

// Read form data
app.use( express.json() )

// Create routes
app.use('/', router)

export default app