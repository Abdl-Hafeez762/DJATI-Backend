import express from "express";
import * as authController from "./auth.controllers";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification des owners et des employés
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un nouveau compte boutique (owner)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Boutique Alger Centre
 *               email:
 *                 type: string
 *                 example: contact@boutique.dz
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 store:
 *                   $ref: '#/components/schemas/Store'
 *       400:
 *         description: Email déjà utilisé ou données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion owner (boutique)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: contact@boutique.dz
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion réussie — retourne un token JWT avec storeId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 store:
 *                   $ref: '#/components/schemas/Store'
 *       401:
 *         description: Email ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/employee/login:
 *   post:
 *     summary: Connexion employé (caissier, manager…)
 *     tags: [Auth]
 *     description: >
 *       Retourne un token JWT contenant `storeId`, `employeeId` et `role`.
 *       Si `mustChangePassword` est `true`, le frontend doit rediriger vers
 *       l'écran de changement de mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: youcef@boutique.dz
 *               password:
 *                 type: string
 *                 example: temppass
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 employee:
 *                   $ref: '#/components/schemas/Employee'
 *                 mustChangePassword:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Email ou mot de passe incorrect, ou compte inactif
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/employee/login", authController.loginEmployee);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion (stateless — le client supprime le token)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Déconnecté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Déconnecté avec succès
 */
router.post("/logout", authController.logout);

export default router;
