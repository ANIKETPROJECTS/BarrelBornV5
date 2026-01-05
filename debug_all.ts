import { MongoClient } from "mongodb";

async function check() {
  const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    
    for (const dbInfo of dbs.databases) {
      if (['admin', 'local', 'config'].includes(dbInfo.name)) continue;
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      for (const collInfo of collections) {
        const count = await db.collection(collInfo.name).countDocuments();
        if (count > 0) {
          const sample = await db.collection(collInfo.name).findOne({});
          console.log(`[${dbInfo.name}.${collInfo.name}] Total: ${count}`);
          console.log(`  Keys: ${Object.keys(sample || {})}`);
          if (collInfo.name.toLowerCase().includes('beer') || collInfo.name.toLowerCase().includes('craft')) {
            console.log(`  MATCH: ${collInfo.name}`);
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

check();
