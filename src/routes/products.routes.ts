import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';

const router = Router();

// Obtener productos (público)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Todas las rutas siguientes requieren autenticación
router.use(authMiddleware);

// Crear, actualizar y eliminar productos (solo admin)
router.post('/', adminOnly, createProduct);
router.put('/:id', adminOnly, updateProduct);
router.delete('/:id', adminOnly, deleteProduct);

export default router;
