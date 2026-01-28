import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, CreatePurchaseDTO } from '../types';

const prisma = new PrismaClient();

export const getAllPurchases = async (req: AuthRequest, res: Response) => {
  try {
    const purchases = await prisma.purchaseOrder.findMany({
      include: {
        product: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(purchases);
  } catch (error) {
    console.error('Error obteniendo compras:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const createPurchase = async (req: AuthRequest, res: Response) => {
  try {
    const {
      productId,
      quantity,
      costPrice,
      salePrice,
      supplier,
      invoiceNumber,
      purchaseDate,
    }: CreatePurchaseDTO = req.body;

    if (!productId || !quantity || !costPrice || !salePrice || !purchaseDate) {
      return res.status(400).json({
        error: 'Producto, cantidad, precio de costo, precio de venta y fecha son requeridos',
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const totalCost = quantity * costPrice;

    // Crear la compra y actualizar stock en una transacción
    const [purchase] = await prisma.$transaction([
      prisma.purchaseOrder.create({
        data: {
          productId,
          quantity,
          costPrice,
          salePrice,
          totalCost,
          supplier,
          invoiceNumber,
          purchaseDate: new Date(purchaseDate),
          createdBy: req.user!.id,
        },
        include: {
          product: true,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          currentStock: {
            increment: quantity,
          },
          salePrice, // Actualizar el precio de venta
        },
      }),
      prisma.inventoryMovement.create({
        data: {
          productId,
          type: 'PURCHASE',
          quantity,
          referenceId: productId, // Se actualizará después
          userId: req.user!.id,
        },
      }),
    ]);

    return res.status(201).json(purchase);
  } catch (error) {
    console.error('Error creando compra:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};
