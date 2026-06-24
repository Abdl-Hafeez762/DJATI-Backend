import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as salesController from "./sales.controllers";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Enregistrement et suivi des ventes
 */

/**
 * @swagger
 * /api/sales/summary:
 *   get:
 *     summary: Résumé global des ventes (toutes périodes confondues)
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques agrégées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   example: 125400
 *                 totalSales:
 *                   type: number
 *                   example: 312
 *                 averageOrder:
 *                   type: number
 *                   example: 402
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/summary", salesController.getSalesSummary);

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Lister toutes les ventes de la boutique
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des ventes (triées par date décroissante)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", salesController.getSales);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Enregistrer une vente
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     description: >
 *       Crée la vente dans une **transaction atomique** :
 *       le stock de chaque article est décrémenté simultanément.
 *       Si un article n'a pas assez de stock, toute la transaction est annulée (rollback).
 *       Le `name`, `unitPrice` et `total` de chaque ligne sont calculés automatiquement depuis l'inventaire.
 *       Si le token est celui d'un employé, `soldBy` est rempli automatiquement.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [itemId, quantity]
 *                   properties:
 *                     itemId:
 *                       type: string
 *                       example: 664f1a2b3c4d5e6f7a8b9c0f
 *                     quantity:
 *                       type: number
 *                       example: 3
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, transfer, other]
 *                 example: cash
 *               note:
 *                 type: string
 *                 example: Client fidèle
 *     responses:
 *       201:
 *         description: Vente enregistrée et stock décrémenté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Stock insuffisant ou article introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", salesController.createSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Modifier une vente (note, paymentMethod)
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 664f1a2b3c4d5e6f7a8b9c10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, transfer, other]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vente mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vente introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", salesController.updateSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Supprimer une vente
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 664f1a2b3c4d5e6f7a8b9c10
 *     responses:
 *       200:
 *         description: Vente supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vente supprimée
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vente introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", salesController.deleteSale);

export default router;
