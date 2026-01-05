import { MongoClient } from "mongodb";

async function check() {
  const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    
    console.log("Searching for 'Kingfisher' or 'Budweiser' or 'Beer' or 'Whisky' in ALL collections of ALL databases...");
    const dbs = await client.db().admin().listDatabases();
    
    for (const dbInfo of dbs.databases) {
      if (['admin', 'local', 'config'].includes(dbInfo.name)) continue;
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      for (const collInfo of collections) {
        const coll = db.collection(collInfo.name);
        const items = await coll.find({
          $or: [
            { name: /kingfisher/i },
            { name: /budweiser/i },
            { name: /beer/i },
            { name: /whisky/i },
            { category: /beer/i },
            { category: /whisky/i },
            { subcategory: /beer/i },
            { subcategory: /whisky/i }
          ]
        }).toArray();
        
        if (items.length > 0) {
          console.log(`Found ${items.length} items in ${dbInfo.name}.${collInfo.name}`);
          console.log("Sample Categories found in these items:", Array.from(new Set(items.map(i => i.category || i.subcategory || i['sub-category']))));
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
