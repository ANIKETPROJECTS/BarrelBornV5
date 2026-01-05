import { MongoClient } from "mongodb";

async function fetchAll() {
  const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    const db = client.db("barrelborn");
    const collections = await db.listCollections().toArray();
    
    console.log("--- Fetching all collections from 'barrelborn' ---");
    for (const collInfo of collections) {
      const coll = db.collection(collInfo.name);
      const count = await coll.countDocuments();
      console.log(`\nCategory/Collection: ${collInfo.name} (${count} items)`);
      
      if (count > 0) {
        const sample = await coll.findOne({});
        console.log(`  Sample item: "${sample?.name}"`);
      } else {
        console.log("  (Empty collection)");
      }
    }
    console.log("\n--- Fetch complete ---");
  } catch (err) {
    console.error("Error fetching collections:", err);
  } finally {
    await client.close();
  }
}

fetchAll();
