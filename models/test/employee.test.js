const mongoose = require("mongoose");
const expect = require("chai").expect;
const Employee = require("../employee.model");

describe("Employee", () => {
	it("should throw an error if no required fields are provided", () => {
		const emp = new Employee({});
		const err = emp.validateSync();
		expect(err.errors.firstName).to.exist;
		expect(err.errors.lastName).to.exist;
		expect(err.errors.department).to.exist;
	});

	it("should throw an error if required fields are empty strings", () => {
		const emp = new Employee({ firstName: "", lastName: "", department: "" });
		const err = emp.validateSync();
		expect(err.errors.firstName).to.exist;
		expect(err.errors.lastName).to.exist;
		expect(err.errors.department).to.exist;
	});

	it("should not throw an error if all required fields are valid", () => {
		const emp = new Employee({
			firstName: "John",
			lastName: "Doe",
			department: new mongoose.Types.ObjectId(),
		});
		const err = emp.validateSync();
		expect(err).to.not.exist;
	});
});
