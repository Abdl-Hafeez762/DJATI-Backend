import request from "supertest";
import app from "../app";

let token: string;
let itemId: string;

beforeEach(async () => {
  const authRes = await request(app).post("/auth/register").send({
    name: "Boutique Test",
    email: "owner@test.com",
    password: "password123",
  });
  token = authRes.body.token;

  const itemRes = await request(app)
    .post("/api/inventory")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Coca-Cola",
      category: "Boissons",
      price: 500,
      cost: 300,
      quantity: 10,
      unit: "bouteille",
    });
  itemId = itemRes.body._id;
});

describe("POST /api/sales", () => {
  it("crée une vente et décrémente le stock", async () => {
    const res = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ itemId, quantity: 2 }], paymentMethod: "cash" });

    expect(res.status).toBe(201);
    expect(res.body.totalAmount).toBe(1000); // 500 * 2
    expect(res.body.items[0].name).toBe("Coca-Cola");
    expect(res.body.items[0].unitPrice).toBe(500);

    const invRes = await request(app)
      .get(`/api/inventory/${itemId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(invRes.body.quantity).toBe(8); // 10 - 2
  });

  it("refuse si le stock est insuffisant", async () => {
    const res = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ itemId, quantity: 50 }], paymentMethod: "cash" });

    expect(res.status).toBe(400);

    // le stock ne doit PAS avoir changé
    const invRes = await request(app)
      .get(`/api/inventory/${itemId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(invRes.body.quantity).toBe(10);
  });

  it("refuse sans authentification", async () => {
    const res = await request(app)
      .post("/api/sales")
      .send({ items: [{ itemId, quantity: 1 }] });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/sales", () => {
  it("retourne la liste des ventes du store", async () => {
    await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ itemId, quantity: 1 }], paymentMethod: "cash" });

    const res = await request(app)
      .get("/api/sales")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("un store ne voit pas les ventes d'un autre store", async () => {
    // créer un deuxième store
    const auth2 = await request(app).post("/auth/register").send({
      name: "Autre Boutique",
      email: "autre@test.com",
      password: "pass",
    });
    const token2 = auth2.body.token;

    // créer une vente dans le store 1
    await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ itemId, quantity: 1 }], paymentMethod: "cash" });

    // le store 2 ne doit rien voir
    const res = await request(app)
      .get("/api/sales")
      .set("Authorization", `Bearer ${token2}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

describe("GET /api/sales/summary", () => {
  it("retourne le résumé avec totalRevenue correct", async () => {
    await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ itemId, quantity: 3 }], paymentMethod: "cash" });

    const res = await request(app)
      .get("/api/sales/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalRevenue).toBe(1500); // 500 * 3
    expect(res.body.totalSales).toBe(1);
  });
});

describe("DELETE /api/sales/:id", () => {
  it("supprime une vente existante", async () => {
    const saleRes = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ itemId, quantity: 1 }], paymentMethod: "cash" });

    const saleId = saleRes.body._id;

    const res = await request(app)
      .delete(`/api/sales/${saleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Vente supprimée");
  });

  it("retourne 404 pour un id inconnu", async () => {
    const res = await request(app)
      .delete("/api/sales/000000000000000000000000")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
