import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';

const router = Router();

// Obtener categorías (público)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Todas las rutas siguientes requieren autenticación
router.use(authMiddleware);

// Crear, actualizar y eliminar categorías (solo admin)
router.post('/', adminOnly, createCategory);
router.put('/:id', adminOnly, updateCategory);
router.delete('/:id', adminOnly, deleteCategory);

export default router;
