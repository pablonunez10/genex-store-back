import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, CreateSaleDTO } from '../types';

const prisma = new PrismaClient();

export const getAllSales = async (req: AuthRequest, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        seller: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    });

    return res.json(sales);
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getMySales = async (req: AuthRequest, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      where: { sellerId: req.user!.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    });

    return res.json(sales);
  } catch (error) {
    console.error('Error obteniendo mis ventas:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getSalesReport = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Fecha requerida' });
    }

    const targetDate = new Date(date as string);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        seller: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    });

    const totalAmount = sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
    const totalSales = sales.length;
    const totalItems = sales.reduce((sum, sale) =>
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    return res.json({
      date: date as string,
      summary: {
        totalAmount,
        totalSales,
        totalItems,
      },
      sales,
    });
  } catch (error) {
    console.error('Error generando reporte:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const createSale = async (req: AuthRequest, res: Response) => {
  try {
    const { items }: CreateSaleDTO = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }

    // Validar stock disponible para todos los productos
    const productsWithStock = await Promise.all(
      items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Producto ${item.productId} no encontrado`);
        }

        if (product.currentStock < item.quantity) {
          throw new Error(
            `Stock insuficiente para ${product.name}. Disponible: ${product.currentStock}, Solicitado: ${item.quantity}`
          );
        }

        return { product, quantity: item.quantity };
      })
    );

    // Calcular total
    let totalAmount = 0;
    const saleItems = productsWithStock.map(({ product, quantity }) => {
      const subtotal = Number(product.salePrice) * quantity;
      totalAmount += subtotal;

      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.salePrice,
        subtotal,
      };
    });

    // Crear venta y actualizar stocks en transacción
    const sale = await prisma.$transaction(async (tx) => {
      // Crear la venta
      const newSale = await tx.sale.create({
        data: {
          totalAmount,
          sellerId: req.user!.id,
          sellerName: req.user!.name,
          saleDate: new Date(),
          items: {
            create: saleItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Actualizar stocks y crear movimientos de inventario
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              decrement: item.quantity,
            },
          },
        });

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            type: 'SALE',
            quantity: -item.quantity,
            referenceId: newSale.id,
            userId: req.user!.id,
          },
        });
      }

      return newSale;
    });

    return res.status(201).json(sale);
  } catch (error: any) {
    console.error('Error creando venta:', error);
    return res.status(400).json({ error: error.message || 'Error en el servidor' });
  }
};
