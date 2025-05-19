import { PrismaClient } from '@prisma/client'
import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// QR code configuration
const QR_CONFIG: QRCode.QRCodeToFileOptions = {
  errorCorrectionLevel: 'H',
  type: 'png',
  margin: 1,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}

// Function to ensure directory exists
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

async function generateQRCodes() {
  try {
    // Get all restaurants with their tables
    const restaurants = await prisma.restaurant.findMany({
      include: {
        tables: true
      }
    })

    // Create QR code directory if it doesn't exist
    const qrDir = path.join(__dirname, '../../frontend/public/qr')
    ensureDirectoryExists(qrDir)

    for (const restaurant of restaurants) {
      // Create restaurant-specific directory
      const restaurantDir = path.join(qrDir, restaurant.id)
      ensureDirectoryExists(restaurantDir)

      console.log(`Generating QR codes for ${restaurant.name}...`)

      // Generate QR code for each table
      for (const table of restaurant.tables) {
        const tableData = {
          restaurantId: restaurant.id,
          tableId: table.id,
          tableNumber: table.number
        }

        // Create QR code URL (you can customize this based on your frontend URL)
        const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/${tableData.restaurantId}/${tableData.tableId}`

        // Generate QR code
        const qrCodePath = path.join(restaurantDir, `table-${table.number}.png`)
        await QRCode.toFile(qrCodePath, qrUrl, QR_CONFIG)

        console.log(`Generated QR code for Table ${table.number}`)
      }
    }

    console.log('✨ QR code generation completed successfully!')
  } catch (error) {
    console.error('Error generating QR codes:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
generateQRCodes()