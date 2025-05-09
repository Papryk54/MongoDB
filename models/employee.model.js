const mongoose = require("mongoose");

const employeesSchema = new mongoose.Schema({
	_id: { type: mongoose.Types.ObjectId, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	department: { type: String, required: true },
});
