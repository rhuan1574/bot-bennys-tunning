const mongoose = require("mongoose");
require('dotenv').config(); // Garante que o .env seja carregado

async function connectToDatabase() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("A variável MONGO_URI não está definida no .env!");
        }

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "BennysTunningDB", // Defina um nome para seu banco
        });

        console.log("✅ Conectado ao MongoDB com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB:", error);
        process.exit(1); // Sai do processo caso haja erro
    }
}

module.exports = connectToDatabase;
