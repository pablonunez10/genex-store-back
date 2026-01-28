import { Router } from 'express';
import {
  getAllSales,
  getMySales,
  getSalesReport,
  createSale,
} from '../controllers/sales.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear venta (vendedor puede registrar ventas)
router.post('/', createSale);

// Mis ventas (vendedor)
router.get('/my-sales', getMySales);

// Todas las ventas (solo admin)
router.get('/', adminOnly, getAllSales);

// Reporte por fecha (solo admin)
router.get('/report', adminOnly, getSalesReport);

export default router;
