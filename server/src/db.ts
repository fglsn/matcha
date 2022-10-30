import { Pool } from 'pg';
import { DB_PORT, DB_NAME } from "./utils/config";

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: DB_NAME,
	password: 'postgres',
	port: DB_PORT
});

export default pool;
