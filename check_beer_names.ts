import { MongoClient } from "mongodb";

async function check() {
  const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    const posDb = client.db("restaurant_pos");
    const allItems = await posDb.collection("menuItems").find({}).toArray();
    
    console.log("Searching for beer keywords in item names...");
    const beerKeywords = [/beer/i, /tap/i, /kingfisher/i, /budweiser/i, /bira/i, /draught/i, /pint/i, /lager/i, /wheat/i, /stout/i, /ale/i];
    
    const matches = allItems.filter(item => 
      beerKeywords.some(kw => kw.test(item.name || ''))
    );

    if (matches.length > 0) {
      console.log(`Found ${matches.length} matches!`);
      matches.forEach(m => console.log(`- ${m.name} | Cat: ${m.category}`));
    } else {
      console.log("No matches found in item names.");
      console.log("Sample items for reference:");
      allItems.slice(0, 20).forEach(i => console.log(`- ${i.name} | Cat: ${i.category}`));
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

check();
