import { PrismaClient, UserRole, OrderStatus, PaymentStatus, TableStatus } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('Starting data migration...')

    // 1. Migrate User roles
    console.log('Migrating user roles...')
    const users = await prisma.user.findMany()
    for (const user of users) {
      // Convert string role to enum
      const newRole = (user.role as string).toLowerCase() === 'admin' 
        ? UserRole.RESTAURANT_ADMIN 
        : UserRole.STAFF
      
      await prisma.user.update({
        where: { id: user.id },
        data: { role: newRole }
      })
    }

    // 2. Migrate Table statuses
    console.log('Migrating table statuses...')
    const tables = await prisma.table.findMany()
    for (const table of tables) {
      let newStatus: TableStatus
      switch ((table.status as string).toLowerCase()) {
        case 'available':
          newStatus = TableStatus.AVAILABLE
          break
        case 'occupied':
          newStatus = TableStatus.OCCUPIED
          break
        case 'reserved':
          newStatus = TableStatus.RESERVED
          break
        default:
          newStatus = TableStatus.AVAILABLE
      }
      await prisma.table.update({
        where: { id: table.id },
        data: { status: newStatus }
      })
    }

    // 3. Migrate Order statuses
    console.log('Migrating order statuses...')
    const orders = await prisma.order.findMany()
    for (const order of orders) {
      let newStatus: OrderStatus
      switch ((order.status as string).toLowerCase()) {
        case 'pending':
          newStatus = OrderStatus.PENDING
          break
        case 'preparing':
          newStatus = OrderStatus.PREPARING
          break
        case 'ready':
          newStatus = OrderStatus.READY
          break
        case 'served':
          newStatus = OrderStatus.SERVED
          break
        case 'cancelled':
          newStatus = OrderStatus.CANCELLED
          break
        default:
          newStatus = OrderStatus.PENDING
      }

      let newPaymentStatus: PaymentStatus
      switch ((order.paymentStatus as string).toLowerCase()) {
        case 'paid':
          newPaymentStatus = PaymentStatus.PAID
          break
        case 'failed':
          newPaymentStatus = PaymentStatus.FAILED
          break
        case 'refunded':
          newPaymentStatus = PaymentStatus.REFUNDED
          break
        default:
          newPaymentStatus = PaymentStatus.PENDING
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: newStatus,
          paymentStatus: newPaymentStatus
        }
      })
    }

    // 4. Create RestaurantOwner records for existing admin users
    console.log('Creating restaurant owner records...')
    const adminUsers = await prisma.user.findMany({
      where: { role: UserRole.RESTAURANT_ADMIN },
      include: { restaurant: true }
    })

    for (const user of adminUsers) {
      if (user.restaurant) {
        await prisma.restaurantOwner.create({
          data: {
            userId: user.id,
            restaurantId: user.restaurant.id,
            role: UserRole.RESTAURANT_OWNER
          }
        })
      }
    }

    console.log('Data migration completed successfully!')
  } catch (error) {
    console.error('Error during migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateData()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  }) 