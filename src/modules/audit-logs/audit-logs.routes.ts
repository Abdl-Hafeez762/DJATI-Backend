import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as auditLogsController from "./audit-logs.controllers";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Audit Logs
 *   description: Traçabilité des actions effectuées dans la boutique
 */

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: Lister tous les logs de la boutique
 *     tags: [Audit Logs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des logs (triés par date décroissante)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", auditLogsController.getLogs);

/**
 * @swagger
 * /api/audit-logs:
 *   post:
 *     summary: Créer un log manuellement
 *     tags: [Audit Logs]
 *     security:
 *       - BearerAuth: []
 *     description: >
 *       Le champ `performedBy` est automatiquement rempli depuis le token JWT
 *       (owner ou employé). L'IP est récupérée depuis la requête.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action, entity]
 *             properties:
 *               action:
 *                 type: string
 *                 example: DELETE_SALE
 *               entity:
 *                 type: string
 *                 enum: [Sale, Inventory, Employee, Store, Auth]
 *                 example: Sale
 *               entityId:
 *                 type: string
 *                 example: 664f1a2b3c4d5e6f7a8b9c10
 *               details:
 *                 type: object
 *                 example: { reason: "erreur de saisie" }
 *     responses:
 *       201:
 *         description: Log créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", auditLogsController.createLog);

/**
 * @swagger
 * /api/audit-logs/export:
 *   get:
 *     summary: Exporter les logs en fichier CSV
 *     tags: [Audit Logs]
 *     security:
 *       - BearerAuth: []
 *     description: >
 *       Retourne un fichier `.csv` téléchargeable avec les colonnes :
 *       `date, action, entity, entityId, performedBy, role, ip`
 *     responses:
 *       200:
 *         description: Fichier CSV téléchargé
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: "date,action,entity,entityId,performedBy,role,ip\n2026-06-01T10:00:00Z,DELETE_SALE,Sale,abc123,storeId,owner,127.0.0.1"
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/export", auditLogsController.exportLogs);

export default router;
