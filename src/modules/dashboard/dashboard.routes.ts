import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as dashboardController from "./dashboard.controllers";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Données en temps réel pour le tableau de bord principal
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Statistiques du jour et du mois (StatCard)
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Chiffres clés pour les cartes du dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dailySales:
 *                   type: number
 *                   description: Chiffre d'affaires du jour
 *                   example: 12400
 *                 monthlySales:
 *                   type: number
 *                   description: Chiffre d'affaires du mois en cours
 *                   example: 248000
 *                 transactions:
 *                   type: number
 *                   description: Nombre de transactions ce mois
 *                   example: 312
 *                 stockAlerts:
 *                   type: number
 *                   description: Nombre d'articles avec stock inférieur à 5
 *                   example: 3
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/stats", dashboardController.getDashboardStats);

/**
 * @swagger
 * /api/dashboard/sales-chart:
 *   get:
 *     summary: Données du graphe de ventes (SaleChart)
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *           default: week
 *         description: Période du graphe
 *     responses:
 *       200:
 *         description: Labels et valeurs pour le graphe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 labels:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
 *                 values:
 *                   type: array
 *                   items:
 *                     type: number
 *                   example: [4200, 6800, 3100, 7400, 5200, 9100, 2300]
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/sales-chart", dashboardController.getSalesChart);

/**
 * @swagger
 * /api/dashboard/top-products:
 *   get:
 *     summary: Top produits les plus vendus (TopProduct)
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des produits par quantité vendue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Coca-Cola 33cl
 *                       sold:
 *                         type: number
 *                         example: 320
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/top-products", dashboardController.getTopProducts);

/**
 * @swagger
 * /api/dashboard/employee-performance:
 *   get:
 *     summary: Performance des employés (EmployeeCard)
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des employés avec leurs métriques de vente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Youcef Benali
 *                       role:
 *                         type: string
 *                         example: cashier
 *                       sales:
 *                         type: number
 *                         description: Chiffre d'affaires généré
 *                         example: 48200
 *                       transactions:
 *                         type: number
 *                         description: Nombre de ventes réalisées
 *                         example: 87
 *                       avatar:
 *                         type: string
 *                         description: Première lettre du prénom (initiale)
 *                         example: Y
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/employee-performance", dashboardController.getEmployeePerformance);

export default router;
