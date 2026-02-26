import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, CreateCategoryDTO, UpdateCategoryDTO } from '../types';

const prisma = new PrismaClient();

export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getCategoryById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    return res.json(category);
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description }: CreateCategoryDTO = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error('Error creando categoría:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description }: UpdateCategoryDTO = req.body;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    if (name && name !== category.name) {
      const existingCategory = await prisma.category.findUnique({
        where: { name },
      });

      if (existingCategory) {
        return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name ?? category.name,
        description: description ?? category.description,
      },
    });

    return res.json(updatedCategory);
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    if (category.products.length > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }

    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    return res.json({ message: 'Categoría desactivada exitosamente' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};
