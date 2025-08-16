import mysql from "mysql2/promise";
const db = await mysql.createConnection({
    host: "localhost",
    user:"root",
    password: "1234",
    database:"todolist"
});
await db.execute("CREATE DATABASE IF NOT EXISTS todolist");
console.log("Connected to the database");
await db.execute(`
    CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('pending', 'completed') DEFAULT 'pending'
    )
`);
export default db;