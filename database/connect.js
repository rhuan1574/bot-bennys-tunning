const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {}); // Removendo opções desnecessárias
    console.log("✅ Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
  }
}

module.exports = connectToDatabase;
