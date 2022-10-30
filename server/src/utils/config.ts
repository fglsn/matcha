const DB_PORT: number = process.env.NODE_ENV === 'test' ? 5433 : 5432;

const DB_NAME: string = process.env.NODE_ENV === 'test' ? 'matcha-test' : 'matcha';

export { DB_NAME, DB_PORT };
