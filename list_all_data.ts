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
        const items = await db.collection(collInfo.name).find({}).limit(5).toArray();
        if (items.length > 0) {
          console.log(`\n[${dbInfo.name}.${collInfo.name}] Sample Items:`);
          items.forEach((item, i) => {
            console.log(`  Item ${i + 1}: ${item.name} | Cat: ${item.category} | SubCat: ${item.subcategory || item['sub-category'] || 'N/A'}`);
          });
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
