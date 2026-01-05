import { MongoClient } from "mongodb";

async function listCollections() {
  const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    const dbs = ['barrelborn', 'mingsdb', 'restaurant_pos'];
    
    for (const dbName of dbs) {
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      console.log(`\nDatabase: ${dbName}`);
      console.log("Collections:", collections.map(c => c.name).sort());
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

listCollections();
