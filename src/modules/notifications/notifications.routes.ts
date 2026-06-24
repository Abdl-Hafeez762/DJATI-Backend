import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as notificationsController from "./notifications.controllers";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Centre de notifications de la boutique
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Lister toutes les notifications de la boutique
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications (triées par date décroissante)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", notificationsController.getNotifications);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Marquer toutes les notifications comme lues
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Toutes les notifications marquées comme lues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Toutes les notifications marquées comme lues
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/read-all", notificationsController.markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Marquer une notification comme lue
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de la notification
 *         example: 664f1a2b3c4d5e6f7a8b9c11
 *     responses:
 *       200:
 *         description: Notification mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Notification introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:id/read", notificationsController.markAsRead);

export default router;
