const mongoose = require("mongoose");

const itemIlegalSchema = new mongoose.Schema({
  userId: String,
  item: String,
  quantidade: Number,
  tipo: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ItemIlegal", itemIlegalSchema);
