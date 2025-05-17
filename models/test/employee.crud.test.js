const mongoose = require("mongoose");
const expect = require("chai").expect;
const Employee = require("../employee.model");
const Department = require("../department.model");

describe("Employee", () => {
	before(async () => {
		try {
			await mongoose.connect("mongodb://localhost:27017/companyDBtest", {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
		} catch (err) {
			console.error(err);
		}
	});

	let dep1, dep2;

	before(async () => {
		await Department.deleteMany();
		dep1 = new Department({ name: "Department #1" });
		dep2 = new Department({ name: "Department #2" });
		await dep1.save();
		await dep2.save();
		await Employee.deleteMany();
	});

	describe("Reading data", () => {
		before(async () => {
			const emp1 = new Employee({
				firstName: "John",
				lastName: "Doe",
				department: dep1._id,
			});
			const emp2 = new Employee({
				firstName: "Jane",
				lastName: "Smith",
				department: dep2._id,
			});
			await emp1.save();
			await emp2.save();
		});

		it('should return all the data with "find" method', async () => {
			const employees = await Employee.find();
			expect(employees.length).to.equal(2);
		});

		it('should return a proper document by "firstName" with "findOne" method', async () => {
			const employee = await Employee.findOne({ firstName: "John" });
			expect(employee.firstName).to.equal("John");
		});
	});

	describe("Creating data", () => {
		it('should insert new document with "insertOne" method', async () => {
			const employee = new Employee({
				firstName: "Alice",
				lastName: "Brown",
				department: dep1._id,
			});
			await employee.save();
			const savedEmployee = await Employee.findOne({ firstName: "Alice" });
			expect(savedEmployee).to.not.be.null;
		});

		it("should set isNew to false after save", async () => {
			const employee = new Employee({
				firstName: "Bob",
				lastName: "White",
				department: dep2._id,
			});
			await employee.save();
			expect(employee.isNew).to.be.false;
		});
	});

	describe("Updating data", () => {
		let employeeToUpdate;

		beforeEach(async () => {
			await Employee.deleteMany();
			employeeToUpdate = new Employee({
				firstName: "Update",
				lastName: "Me",
				department: dep1._id,
			});
			await employeeToUpdate.save();

			const anotherEmployee = new Employee({
				firstName: "Another",
				lastName: "Person",
				department: dep2._id,
			});
			await anotherEmployee.save();
		});

		it('should properly update one document with "updateOne" method', async () => {
			await Employee.updateOne(
				{ firstName: "Update" },
				{ $set: { lastName: "Updated" } }
			);
			const updatedEmployee = await Employee.findOne({ lastName: "Updated" });
			expect(updatedEmployee).to.not.be.null;
		});

		it('should properly update one document with "save" method', async () => {
			const employee = await Employee.findOne({ firstName: "Update" });
			employee.lastName = "SavedUpdate";
			await employee.save();

			const updatedEmployee = await Employee.findOne({
				lastName: "SavedUpdate",
			});
			expect(updatedEmployee).to.not.be.null;
		});

		it('should properly update multiple documents with "updateMany" method', async () => {
			await Employee.updateMany({}, { $set: { lastName: "BulkUpdated" } });
			const employees = await Employee.find();
			expect(employees[0].lastName).to.equal("BulkUpdated");
			expect(employees[1].lastName).to.equal("BulkUpdated");
		});
	});

	describe("Removing data", () => {
		beforeEach(async () => {
			await Employee.deleteMany();
			const emp1 = new Employee({
				firstName: "Delete",
				lastName: "One",
				department: dep1._id,
			});
			const emp2 = new Employee({
				firstName: "Delete",
				lastName: "Two",
				department: dep2._id,
			});
			await emp1.save();
			await emp2.save();
		});

		it('should properly remove one document with "deleteOne" method', async () => {
			await Employee.deleteOne({ lastName: "One" });
			const removedEmployee = await Employee.findOne({ lastName: "One" });
			expect(removedEmployee).to.be.null;
		});

		it('should properly remove multiple documents with "deleteMany" method', async () => {
			await Employee.deleteMany();
			const employees = await Employee.find();
			expect(employees.length).to.equal(0);
		});
	});

	after(async () => {
		await Employee.deleteMany();
		await Department.deleteMany();
		await mongoose.connection.close();
	});
});
