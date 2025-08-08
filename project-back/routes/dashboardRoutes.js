import { Router } from 'express';
import { getDashboardSummary, getSalesStats, getTopProducts, getSalesByStatus, getInventoryAlerts } from '../controllers/dashboardController.js';

const router = Router();
router.get('/summary', getDashboardSummary);
router.get('/sales-stats', getSalesStats);
router.get('/top-products', getTopProducts);
router.get('/sales-by-status', getSalesByStatus);
router.get('/inventory-alerts', getInventoryAlerts);

export default router;