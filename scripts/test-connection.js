import pg from 'pg';
const { Client } = pg;

async function testConnection() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  console.log("Testing connection to:", url?.replace(/:[^:@]+@/, ':****@'));
  
  if (!url) {
    console.log("ERROR: No DATABASE_URL or POSTGRES_URL found");
    return;
  }

  const client = new Client({ connectionString: url });
  
  try {
    await client.connect();
    console.log("SUCCESS: Connected to database!");
    
    const result = await client.query('SELECT current_database() as db, current_user as user');
    console.log("Database:", result.rows[0].db);
    console.log("User:", result.rows[0].user);
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 10
    `);
    console.log("Tables in public schema:", tables.rows.map(r => r.table_name));
    
  } catch (error) {
    console.log("ERROR:", error.message);
  } finally {
    await client.end();
  }
}

testConnection();
