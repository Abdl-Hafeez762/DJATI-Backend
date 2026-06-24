import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as inventoryController from "./inventory.controllers";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Gestion de l'inventaire de la boutique
 */

/**
 * @swagger
 * /api/inventory/categories:
 *   get:
 *     summary: Lister les catégories distinctes de l'inventaire
 *     tags: [Inventory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Boissons", "Snacks", "Hygiène"]
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/categories", inventoryController.getCategories);

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Lister tous les articles de l'inventaire
 *     tags: [Inventory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des articles actifs de la boutique
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItem'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", inventoryController.getInventory);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Récupérer un article par son ID
 *     tags: [Inventory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de l'article
 *         example: 664f1a2b3c4d5e6f7a8b9c0f
 *     responses:
 *       200:
 *         description: Article trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", inventoryController.getInventoryItem);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Ajouter un article à l'inventaire
 *     tags: [Inventory]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, price, quantity]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Coca-Cola 33cl
 *               category:
 *                 type: string
 *                 example: Boissons
 *               price:
 *                 type: number
 *                 description: Prix de vente
 *                 example: 80
 *               cost:
 *                 type: number
 *                 description: Prix d'achat (pour le calcul de marge)
 *                 example: 55
 *               quantity:
 *                 type: number
 *                 example: 120
 *               unit:
 *                 type: string
 *                 example: bouteille
 *               description:
 *                 type: string
 *                 example: Boisson gazeuse 33cl
 *     responses:
 *       201:
 *         description: Article créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", inventoryController.createInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Modifier un article de l'inventaire
 *     tags: [Inventory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 664f1a2b3c4d5e6f7a8b9c0f
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               cost:
 *                 type: number
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Article mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", inventoryController.updateInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Supprimer un article de l'inventaire
 *     tags: [Inventory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 664f1a2b3c4d5e6f7a8b9c0f
 *     responses:
 *       200:
 *         description: Article supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Article supprimé
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", inventoryController.deleteInventoryItem);

export default router;
