import pg from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

console.log("Connection string exists:", !!connectionString);
console.log("Connection string preview:", connectionString ? connectionString.substring(0, 30) + "..." : "NOT SET");

if (!connectionString) {
  console.error("No database URL found!");
  process.exit(1);
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();
  console.log("Successfully connected to database!");
  
  const result = await client.query("SELECT current_database(), current_user, version()");
  console.log("Database:", result.rows[0].current_database);
  console.log("User:", result.rows[0].current_user);
  console.log("Version:", result.rows[0].version.substring(0, 50) + "...");
  
  // List tables
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);
  console.log("Tables in public schema:", tables.rows.map(r => r.table_name));
  
  await client.end();
  console.log("Connection test passed!");
} catch (error) {
  console.error("Connection failed:", error.message);
  process.exit(1);
}
