const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function start() {
	try {
		await client.connect();
		console.log("Successfully connected to the database");
		const db = client.db("companyDB");
		app.locals.db = db;

		app.use(cors());
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));

		const employeesRoutes = require("./routes/employees.routes");
		const departmentsRoutes = require("./routes/departments.routes");
		const productsRoutes = require("./routes/products.routes");

		app.use((req, res, next) => { // a to wszystko robimy po to żebyśmy mogli w każdym pliku odwołać się do db bez tego const db = client.db("companyDB");
			req.db = db;
			next(); //Potrzebne tylko kiedy modyfiujemy req
		});
		app.use("/api/employees", employeesRoutes);
		app.use("/api/departments", departmentsRoutes);
		app.use("/api/products", productsRoutes);

		app.use((req, res) => res.status(404).send({ message: "Not found..." }));

		app.listen(8000, () => console.log("Server is running on port 8000"));
	} catch (err) {
		console.error("DB connection error:", err);
		process.exit(1);
	}
}

start();
