import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as employeeController from "./employees.controllers";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Gestion des employés de la boutique
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Lister tous les employés de la boutique
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des employés (password exclu)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", employeeController.getEmployees);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Récupérer un employé par son ID
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de l'employé
 *         example: 664f1a2b3c4d5e6f7a8b9c0e
 *     responses:
 *       200:
 *         description: Employé trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Employé introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", employeeController.getEmployee);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Créer un employé (owner uniquement)
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     description: >
 *       Le `storeId` est automatiquement déduit du token JWT.
 *       Le mot de passe est hashé côté serveur. `mustChangePassword` est `true` par défaut.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, role]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Youcef
 *               lastName:
 *                 type: string
 *                 example: Benali
 *               email:
 *                 type: string
 *                 example: youcef@boutique.dz
 *               phone:
 *                 type: string
 *                 example: "0661234567"
 *               role:
 *                 type: string
 *                 enum: [manager, cashier, employee]
 *                 example: cashier
 *               password:
 *                 type: string
 *                 description: Mot de passe temporaire communiqué à l'employé
 *                 example: temp1234
 *     responses:
 *       201:
 *         description: Employé créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Données invalides ou email déjà utilisé
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
router.post("/", employeeController.createEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Modifier un employé
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 664f1a2b3c4d5e6f7a8b9c0e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [manager, cashier, employee]
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Employé mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Employé introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", employeeController.updateEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Supprimer un employé
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 664f1a2b3c4d5e6f7a8b9c0e
 *     responses:
 *       200:
 *         description: Employé supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employé supprimé
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Employé introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", employeeController.deleteEmployee);

export default router;
