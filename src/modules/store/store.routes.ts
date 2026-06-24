import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as storeController from "./store.controllers";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Paramètres et gestion de la boutique
 */

/**
 * @swagger
 * /api/store/settings:
 *   get:
 *     summary: Récupérer les paramètres de la boutique
 *     tags: [Store]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Paramètres de la boutique
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/settings", storeController.getSettings);

/**
 * @swagger
 * /api/store/settings:
 *   put:
 *     summary: Modifier les paramètres de la boutique
 *     tags: [Store]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nouveau nom
 *               phone:
 *                 type: string
 *                 example: "0555000111"
 *               address:
 *                 type: string
 *                 example: 5 Rue de la Liberté, Oran
 *               currency:
 *                 type: string
 *                 example: DZD
 *               logo:
 *                 type: string
 *                 example: https://cdn.example.com/logo.png
 *     responses:
 *       200:
 *         description: Paramètres mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Boutique introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/settings", storeController.updateSettings);

/**
 * @swagger
 * /api/store/password:
 *   put:
 *     summary: Modifier le mot de passe du compte owner
 *     tags: [Store]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: ancienmdp
 *               newPassword:
 *                 type: string
 *                 example: nouveaumdp123
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mot de passe mis à jour
 *       400:
 *         description: Mot de passe actuel incorrect
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
router.put("/password", storeController.updatePassword);

/**
 * @swagger
 * /api/store:
 *   delete:
 *     summary: Supprimer définitivement la boutique
 *     tags: [Store]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Boutique supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Boutique supprimée
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/", storeController.deleteStore);

export default router;
