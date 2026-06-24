import request from "supertest";
import app from "../app";

const storePayload = {
  name: "Boutique Test",
  email: "owner@test.com",
  password: "password123",
};

describe("POST /auth/register", () => {
  it("crée un store et retourne un token", async () => {
    const res = await request(app).post("/auth/register").send(storePayload);

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.store.email).toBe(storePayload.email);
    expect(res.body.store.password).toBeUndefined();
  });

  it("refuse si l'email est déjà utilisé", async () => {
    await request(app).post("/auth/register").send(storePayload);
    const res = await request(app).post("/auth/register").send(storePayload);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Un compte avec cet email existe déjà");
  });
});

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/auth/register").send(storePayload);
  });

  it("connecte avec les bons identifiants", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: storePayload.email, password: storePayload.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.store.email).toBe(storePayload.email);
  });

  it("refuse avec un mauvais mot de passe", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: storePayload.email, password: "mauvais" });

    expect(res.status).toBe(401);
  });

  it("refuse avec un email inconnu", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "inconnu@test.com", password: "pass" });

    expect(res.status).toBe(401);
  });
});

describe("POST /auth/employee/login", () => {
  let storeToken: string;

  beforeEach(async () => {
    const authRes = await request(app).post("/auth/register").send(storePayload);
    storeToken = authRes.body.token;

    await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${storeToken}`)
      .send({
        firstName: "Ali",
        lastName: "Diallo",
        email: "ali@boutique.com",
        password: "temppass",
        role: "cashier",
        phone: "0612345678",
      });
  });

  it("connecte l'employé avec ses identifiants", async () => {
    const res = await request(app)
      .post("/auth/employee/login")
      .send({ email: "ali@boutique.com", password: "temppass" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.employee.email).toBe("ali@boutique.com");
    expect(res.body.mustChangePassword).toBe(true);
  });

  it("refuse avec un mauvais mot de passe", async () => {
    const res = await request(app)
      .post("/auth/employee/login")
      .send({ email: "ali@boutique.com", password: "mauvais" });

    expect(res.status).toBe(401);
  });
});

describe("Middleware auth", () => {
  it("refuse une requête sans token", async () => {
    const res = await request(app).get("/api/inventory");
    expect(res.status).toBe(401);
  });

  it("refuse un token invalide", async () => {
    const res = await request(app)
      .get("/api/inventory")
      .set("Authorization", "Bearer token_bidon");
    expect(res.status).toBe(401);
  });
});
