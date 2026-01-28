import { Router } from 'express';
import { getAllPurchases, createPurchase } from '../controllers/purchases.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';

const router = Router();

// Todas las rutas requieren autenticación y ser admin
router.use(authMiddleware);
router.use(adminOnly);

router.get('/', getAllPurchases);
router.post('/', createPurchase);

export default router;
