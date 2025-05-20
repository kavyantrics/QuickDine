import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { prisma } from './utils/db'
import v1Router from './routes'

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 8000

// Middleware

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL!] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json())

// Routes
app.use('/api/v1', v1Router)
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    res.json({ 
      status: 'ok',
      database: 'connected'
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
})

// Error handling
app.use(errorHandler)

// Database connection and server startup
const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`)
    })
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

startServer()