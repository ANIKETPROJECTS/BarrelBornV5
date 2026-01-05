import { MongoClient } from "mongodb";

async function check() {
  const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    const db = client.db("restaurant_pos");
    const items = await db.collection("menuItems").find({}).toArray();
    const catSet = new Set();
    const subCatSet = new Set();
    const sub2CatSet = new Set();
    
    items.forEach(i => {
      if (i.category) catSet.add(i.category);
      if (i.subcategory) subCatSet.add(i.subcategory);
      if (i['sub-category']) sub2CatSet.add(i['sub-category']);
    });
    
    console.log("Categories:", Array.from(catSet));
    console.log("Subcategories:", Array.from(subCatSet));
    console.log("Sub-categories:", Array.from(sub2CatSet));

    const craftItems = items.filter(i => 
      (i.category && i.category.toLowerCase().includes('craft')) ||
      (i.subcategory && i.subcategory.toLowerCase().includes('craft')) ||
      (i['sub-category'] && i['sub-category'].toLowerCase().includes('craft'))
    );
    console.log("Craft items count:", craftItems.length);
    if (craftItems.length > 0) {
      console.log("Craft Item Sample:", JSON.stringify(craftItems[0], null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

check();
