const { MongoMemoryReplSet } = require("mongodb-memory-server");

module.exports = async () => {
  process.env.JWT_SECRET = "test_secret_jest";

  // ReplSet requis pour les transactions MongoDB (utilisées dans createSale)
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  process.env.MONGO_URI_TEST = replSet.getUri();
  global.__MONGOD__ = replSet;
};
