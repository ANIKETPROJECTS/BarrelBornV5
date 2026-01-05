import { MongoClient } from "mongodb";

async function check() {
  const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    console.log("Available databases:", dbs.databases.map(db => db.name));
    
    for (const dbInfo of dbs.databases) {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      console.log(`\nDatabase: ${dbInfo.name}`);
      console.log("Collections:", collections.map(c => c.name));
      
      for (const collInfo of collections) {
        if (collInfo.name.includes('beer') || collInfo.name.includes('craft') || collInfo.name.includes('menu')) {
          const count = await db.collection(collInfo.name).countDocuments();
          console.log(`- ${collInfo.name}: ${count} items`);
          if (count > 0) {
            const sample = await db.collection(collInfo.name).findOne({});
            console.log("  Sample Category:", sample?.category || sample?.subcategory || sample?.['sub-category'] || "N/A");
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
