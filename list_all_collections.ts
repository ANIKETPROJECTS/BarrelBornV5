import { MongoClient } from "mongodb";

async function list() {
  const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    
    // Check all databases accessible via this connection string
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log("Databases found:", dbs.databases.map(d => d.name));

    for (const dbInfo of dbs.databases) {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      console.log(`\n--- Database: ${dbInfo.name} ---`);
      console.log("Collections:", collections.map(c => c.name).sort());
      
      // Specifically check for whiskey collections
      const whiskeyColls = collections.filter(c => c.name.includes('whiskey') || c.name.includes('whisky'));
      if (whiskeyColls.length > 0) {
        console.log("Whiskey collections found in this DB!");
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

list();
