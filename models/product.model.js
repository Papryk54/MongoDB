const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
	_id: { type: mongoose.Types.ObjectId, required: true },
	name: { type: String, required: true },
	client: { type: String, required: true },
});

module.exports = mongoose.model("Products", productsSchema);