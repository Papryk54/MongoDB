const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
	_id: { type: mongoose.Types.ObjectId, required: true },
	name: { type: String, required: true, minlength: 5, maxlength: 20 },
});

module.exports = mongoose.model("Department", departmentSchema);
