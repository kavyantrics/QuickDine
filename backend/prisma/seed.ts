import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create a sample restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Sample Restaurant',
      email: 'sample@restaurant.com',
      description: 'A sample restaurant with delicious food',
      address: '123 Food Street, Foodville',
      phone: '+1234567890'
    }
  })

  // Create an admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@restaurant.com',
      password: hashedPassword,
      role: 'admin',
      restaurantId: restaurant.id
    }
  })

  // Create sample tables
  for (let i = 1; i <= 10; i++) {
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
      name: 'Pizza',
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
      name: 'Pasta',
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
      name: 'Beverages',
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