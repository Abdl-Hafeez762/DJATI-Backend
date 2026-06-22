
const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API DJATI 🚀",
  });
});

module.exports = app;