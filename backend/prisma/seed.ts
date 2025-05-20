import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { hashPassword } from '../src/middleware/auth'

const prisma = new PrismaClient()

const REFRESH_TOKEN_EXPIRY = '7d'

function generateRefreshToken(user: any) {
  return jwt.sign(
    {
      userId: user.id,
      tokenType: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  )
}

async function main() {
  // Create a sample restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Sample Restaurant',
      email: 'sample@restaurant.com',
      description: 'A sample restaurant for testing',
      address: '123 Test St',
      phone: '123-456-7890',
      tables: {
        create: {
          number: 1,
          capacity: 4,
          qrCode: 'sample-table-1'
        }
      },
      menuItems: {
        create: [
          {
            name: 'Margherita Pizza',
            description: 'Classic tomato sauce, mozzarella, and basil',
            price: 12.99,
            category: 'MAIN_COURSE',
            isAvailable: true
          },
          {
            name: 'Caesar Salad',
            description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing',
            price: 8.99,
            category: 'STARTER',
            isAvailable: true
          },
          {
            name: 'Chocolate Cake',
            description: 'Rich chocolate cake with ganache',
            price: 6.99,
            category: 'DESSERT',
            isAvailable: true
          },
          {
            name: 'Cola',
            description: 'Refreshing cola drink',
            price: 2.99,
            category: 'DRINKS',
            isAvailable: true
          }
        ]
      }
    }
  })

  // Create an admin user
  const hashedPassword = await hashPassword('Admin123!')
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@restaurant.com',
      password: hashedPassword,
      role: 'RESTAURANT_ADMIN',
      restaurantId: restaurant.id
    }
  })
  // Create a refresh token and session for admin
  const refreshToken = generateRefreshToken(adminUser)
  await prisma.session.create({
    data: {
      userId: adminUser.id,
      sessionToken: refreshToken,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  // Create sample tables
  for (let i = 2; i <= 10; i++) {
    await prisma.table.create({
      data: {
        number: i,
        capacity: 4,
        qrCode: `${restaurant.id}-table-${i}`,
        restaurantId: restaurant.id
      }
    })
  }

  // Define menu categories and items
  const categories = [
    {
      name: 'MAIN_COURSE' as const,
      items: [
        {
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and basil',
          price: 12.99,
          isAvailable: true
        },
        {
          name: 'Vegetarian Supreme Pizza',
          description: 'Loaded with fresh vegetables and mushrooms',
          price: 14.99,
          isAvailable: true
        }
      ]
    },
    {
      name: 'MAIN_COURSE' as const,
      items: [
        {
          name: 'Pasta Alfredo',
          description: 'Creamy fettuccine pasta with parmesan cheese sauce',
          price: 13.99,
          isAvailable: true
        },
        {
          name: 'Spaghetti Arrabbiata',
          description: 'Spicy tomato sauce with garlic and red chili',
          price: 11.99,
          isAvailable: true
        }
      ]
    },
    {
      name: 'DRINKS' as const,
      items: [
        {
          name: 'Fresh Lemonade',
          description: 'Homemade lemonade with mint leaves',
          price: 3.99,
          isAvailable: true
        },
        {
          name: 'Iced Tea',
          description: 'House-brewed iced tea with lemon',
          price: 2.99,
          isAvailable: true
        }
      ]
    }
  ]

  // Create menu items
  for (const category of categories) {
    for (const item of category.items) {
      await prisma.menuItem.create({
        data: {
          ...item,
          category: category.name,
          restaurantId: restaurant.id
        }
      })
    }
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })