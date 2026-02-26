import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, CreateProductDTO } from '../types';

const prisma = new PrismaClient();

export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    return res.json(products);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, sku, description, salePrice, categoryId }: CreateProductDTO = req.body;

    if (!name || !sku || !salePrice || !categoryId) {
      return res.status(400).json({ error: 'Nombre, SKU, precio de venta y categoría son requeridos' });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      return res.status(400).json({ error: 'Ya existe un producto con ese SKU' });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(400).json({ error: 'La categoría no existe' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        salePrice,
        categoryId,
        currentStock: 0,
      },
      include: {
        category: true,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Error creando producto:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, salePrice, categoryId } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(400).json({ error: 'La categoría no existe' });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? product.name,
        description: description ?? product.description,
        salePrice: salePrice ?? product.salePrice,
        categoryId: categoryId !== undefined ? categoryId : product.categoryId,
      },
      include: {
        category: true,
      },
    });

    return res.json(updatedProduct);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return res.json({ message: 'Producto desactivado exitosamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};
