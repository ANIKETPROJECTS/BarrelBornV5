import { MongoClient } from "mongodb";

async function check() {
  const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    
    // Check all collections for "Craft" or "Beer" items
    const db = client.db("barrelborn");
    const collections = await db.listCollections().toArray();
    
    console.log("Searching for 'Beer' or 'Tap' in all collections...");
    for (const collInfo of collections) {
      const coll = db.collection(collInfo.name);
      const items = await coll.find({
        $or: [
          { name: /beer/i },
          { name: /tap/i },
          { category: /beer/i },
          { category: /tap/i },
          { subcategory: /beer/i }
        ]
      }).toArray();
      
      if (items.length > 0) {
        console.log(`Found ${items.length} items in collection: ${collInfo.name}`);
        console.log("Sample:", JSON.stringify(items[0], null, 2));
      }
    }

    // Check restaurant_pos menuItems with very broad search
    const posDb = client.db("restaurant_pos");
    const allPosItems = await posDb.collection("menuItems").find({}).limit(100).toArray();
    console.log("Total POS items (sample):", allPosItems.length);
    const categories = Array.from(new Set(allPosItems.map(i => i.category || i.subcategory || i['sub-category'])));
    console.log("POS Categories found:", categories);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

check();
