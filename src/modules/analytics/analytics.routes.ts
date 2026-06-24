import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as analyticsController from "./analytics.controllers";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Statistiques et tableaux de bord
 */

/**
 * @swagger
 * /api/analytics/dashboard-stats:
 *   get:
 *     summary: Statistiques globales (toutes périodes)
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Chiffres clés de la boutique
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   example: 850000
 *                 totalSales:
 *                   type: number
 *                   example: 1240
 *                 inventoryCount:
 *                   type: number
 *                   example: 87
 *                 lowStockItems:
 *                   type: number
 *                   description: Nombre d'articles avec moins de 5 unités
 *                   example: 4
 *                 employeeCount:
 *                   type: number
 *                   example: 3
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/dashboard-stats", analyticsController.getDashboardStats);

/**
 * @swagger
 * /api/analytics/kpis:
 *   get:
 *     summary: Indicateurs de performance sur une période
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *         description: Période d'analyse
 *         example: 30d
 *     responses:
 *       200:
 *         description: KPIs de la période
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 revenue:
 *                   type: number
 *                   example: 125400
 *                 salesCount:
 *                   type: number
 *                   example: 312
 *                 averageOrderValue:
 *                   type: number
 *                   example: 402
 *                 revenueGrowth:
 *                   type: number
 *                   nullable: true
 *                   description: Croissance en % vs période précédente (null si pas de données)
 *                   example: 12.5
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/kpis", analyticsController.getKpis);

/**
 * @swagger
 * /api/analytics/revenue-chart:
 *   get:
 *     summary: Données de revenus jour par jour (pour graphe)
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *         description: Période du graphe
 *     responses:
 *       200:
 *         description: Tableau de points pour le graphe
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     example: "2026-06-01"
 *                   revenue:
 *                     type: number
 *                     example: 4200
 *                   count:
 *                     type: number
 *                     description: Nombre de ventes ce jour
 *                     example: 11
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/revenue-chart", analyticsController.getRevenueChart);

/**
 * @swagger
 * /api/analytics/category-distribution:
 *   get:
 *     summary: Répartition de l'inventaire par catégorie (pour camembert)
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Distribution par catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     example: Boissons
 *                   count:
 *                     type: number
 *                     example: 24
 *                   totalValue:
 *                     type: number
 *                     description: Valeur totale (prix × quantité)
 *                     example: 48000
 *                   totalQuantity:
 *                     type: number
 *                     example: 600
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/category-distribution", analyticsController.getCategoryDistribution);

/**
 * @swagger
 * /api/analytics/top-sellers:
 *   get:
 *     summary: Top 10 des employés par chiffre d'affaires généré
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     description: >
 *       Ne retourne que les ventes créées par des employés connectés (`soldBy` présent).
 *       Les ventes créées par l'owner ne sont pas incluses.
 *     responses:
 *       200:
 *         description: Classement des employés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   totalSales:
 *                     type: number
 *                     example: 45
 *                   totalRevenue:
 *                     type: number
 *                     example: 18200
 *                   employee:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                         example: Youcef
 *                       lastName:
 *                         type: string
 *                         example: Benali
 *                       role:
 *                         type: string
 *                         example: cashier
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/top-sellers", analyticsController.getTopSellers);

/**
 * @swagger
 * /api/analytics/top-products:
 *   get:
 *     summary: Top 10 des produits les plus vendus
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Classement des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   itemId:
 *                     type: string
 *                     example: 664f1a2b3c4d5e6f7a8b9c0f
 *                   name:
 *                     type: string
 *                     example: Coca-Cola 33cl
 *                   totalQuantity:
 *                     type: number
 *                     example: 320
 *                   totalRevenue:
 *                     type: number
 *                     example: 25600
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/top-products", analyticsController.getTopProducts);

export default router;
