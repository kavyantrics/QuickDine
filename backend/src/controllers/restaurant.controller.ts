import { Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/errors'
import {
  RestaurantSchema,
  CreateRestaurantSchema,
  UpdateRestaurantSchema,
  MenuItemSchema,
  UpdateMenuItemSchema,
  RestaurantRegistrationSchema
} from '../schemas/validation'
import { Restaurant, MenuItem } from '../types'

export const restaurantController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const data = RestaurantRegistrationSchema.parse(req.body);

      // Check if restaurant email already exists
      const existingRestaurant = await prisma.restaurant.findUnique({
        where: { email: data.email }
      });

      if (existingRestaurant) {
        return next(new AppError('Restaurant with this email already exists', 400));
      }

      // Check if admin email already exists
      const existingAdmin = await prisma.user.findUnique({
        where: { email: data.adminEmail }
      });

      if (existingAdmin) {
        return next(new AppError('Admin email already registered', 400));
      }

      // Hash admin password
      const hashedPassword = await bcrypt.hash(data.adminPassword, 10);

      // Create restaurant and admin user in a transaction
      const result = await prisma.$transaction(async (tx: any) => {
        // Create restaurant
        const restaurant = await tx.restaurant.create({
          data: {
            name: data.name,
            email: data.email,
            description: data.description,
            address: data.address,
            phone: data.phone,
            logo: data.logo,
            staff: {
              connect: { id: userId } // Connect the userId from params
            }
          }
        });

        // Create admin user
        const admin = await tx.user.create({
          data: {
            name: data.adminName,
            email: data.adminEmail,
            password: hashedPassword,
            role: 'admin',
            restaurantId: restaurant.id
          }
        });

        // Create tables
        const tables = await Promise.all(
          Array.from({ length: data.numberOfTables }, (_, i) => (
            tx.table.create({
              data: {
                number: i + 1,
                capacity: data.tableCapacity,
                qrCode: `${restaurant.id}-table-${i + 1}`,
                restaurantId: restaurant.id
              }
            })
          ))
        );

        return { restaurant, admin, tables };
      });

      // Generate JWT for admin
      const token = jwt.sign(
        { userId: result.admin.id, role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        data: {
          restaurant: {
            id: result.restaurant.id,
            name: result.restaurant.name,
            email: result.restaurant.email,
            description: result.restaurant.description,
            address: result.restaurant.address,
            phone: result.restaurant.phone,
            logo: result.restaurant.logo,
            numberOfTables: result.tables.length
          },
          admin: {
            id: result.admin.id,
            name: result.admin.name,
            email: result.admin.email,
            role: result.admin.role
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getMenu: async (req: Request, res: Response) => {
    try {
      const { restaurantId, tableId } = req.query

      if (!restaurantId || !tableId) {
        return res.status(400).json({
          success: false,
          error: 'Restaurant ID and Table ID are required'
        })
      }

      // Verify table belongs to restaurant
      const table = await prisma.table.findFirst({
        where: {
          id: tableId as string,
          restaurantId: restaurantId as string
        }
      })

      if (!table) {
        return res.status(404).json({
          success: false,
          error: 'Table not found'
        })
      }

      // Get menu items for the restaurant
      const menuItems = await prisma.menuItem.findMany({
        where: {
          restaurantId: restaurantId as string,
          isAvailable: true
        },
        orderBy: {
          category: 'asc'
        }
      })

      res.json({
        success: true,
        data: menuItems
      })
    } catch (error) {
      console.error('Error fetching menu:', error)
      res.status(500).json({ error: 'Failed to fetch menu' })
    }
  },

  createRestaurant: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      const data = CreateRestaurantSchema.parse(req.body)
      const restaurant = await prisma.restaurant.create({
        data: {
          ...data,
          staff: {
            connect: { id: userId }
          }
        }
      })
      res.status(201).json({ success: true, data: restaurant })
    } catch (error) {
      console.error('Error creating restaurant:', error)
      res.status(500).json({ error: 'Failed to create restaurant' })
    }
  },

  getRestaurant: async (req: Request, res: Response) => {
    try {
      const { userId, restaurantId } = req.params
      const restaurant = await prisma.restaurant.findFirst({
        where: {
          id: restaurantId,
          staff: { some: { id: userId } }
        },
        include: {
          staff: true,
          owners: true,
          menuItems: true,
          tables: true
        }
      })
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found for this user' })
      }
      res.json({ success: true, data: restaurant })
    } catch (error) {
      console.error('Error fetching restaurant:', error)
      res.status(500).json({ error: 'Failed to fetch restaurant' })
    }
  },

  updateRestaurant: async (req: Request, res: Response) => {
    try {
      const { userId, restaurantId } = req.params
      const data = UpdateRestaurantSchema.parse(req.body)
      const restaurant = await prisma.restaurant.updateMany({
        where: {
          id: restaurantId,
          staff: { some: { id: userId } }
        },
        data
      })
      if (restaurant.count === 0) {
        return res.status(404).json({ error: 'Restaurant not found or not owned by user' })
      }
      res.json({ success: true, data: restaurant })
    } catch (error) {
      console.error('Error updating restaurant:', error)
      res.status(500).json({ error: 'Failed to update restaurant' })
    }
  },

  createMenuItem: async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      const data = MenuItemSchema.parse({
        ...req.body,
        restaurantId, // override with param
      });
      const menuItem = await prisma.menuItem.create({
        data
      });
      res.status(201).json({ success: true, data: menuItem });
    } catch (error) {
      console.error('Error creating menu item:', error);
      res.status(500).json({ error: 'Failed to create menu item' });
    }
  },

  updateMenuItem: async (req: Request, res: Response) => {
    try {
      const { restaurantId, id } = req.params;
      const data = UpdateMenuItemSchema.parse(req.body);

      // Optionally, ensure the menu item belongs to the restaurant
      const menuItem = await prisma.menuItem.update({
        where: { id },
        data: {
          ...data,
          restaurantId, // ensure restaurantId is not changed
        }
      });
      res.json({ success: true, data: menuItem });
    } catch (error) {
      console.error('Error updating menu item:', error);
      res.status(500).json({ error: 'Failed to update menu item' });
    }
  },

  deleteMenuItem: async (req: Request, res: Response) => {
    try {
      const { restaurantId, id } = req.params;

      // Optionally, ensure the menu item belongs to the restaurant before deleting
      await prisma.menuItem.delete({
        where: { id }
      });
      res.json({ success: true, message: 'Menu item deleted successfully' });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  },

  // Get all menu items for a restaurant (admin)
  getAdminMenu: async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      if (!restaurantId) {
        return res.status(400).json({ success: false, error: 'restaurantId is required' });
      }
      const menuItems = await prisma.menuItem.findMany({
        where: { restaurantId },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: menuItems });
    } catch (error) {
      console.error('Error fetching admin menu:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch menu items' });
    }
  }
}
