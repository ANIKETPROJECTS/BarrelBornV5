import { MongoClient } from "mongodb";

async function list() {
  // Try to connect and list EVERYTHING accessible to this user
  const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    
    // Check all visible databases
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log("Databases found:", dbs.databases.map(d => d.name));

    for (const dbInfo of dbs.databases) {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      console.log(`\n--- Database: ${dbInfo.name} ---`);
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  - ${col.name} (${count} docs)`);
      }
    }

    // Try a direct connection to 'barrelborn' just in case there's a namespacing issue
    console.log("\n--- Direct Check: barrelborn (Cluster Context) ---");
    const barrelDb = client.db("barrelborn");
    const barrelColls = await barrelDb.listCollections().toArray();
    console.log("Collections in 'barrelborn':", barrelColls.map(c => c.name));

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

list();
