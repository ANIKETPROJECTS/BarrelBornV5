import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { type User, type InsertUser, type MenuItem, type InsertMenuItem, type CartItem, type InsertCartItem } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  getCategories(): string[];
  addMenuItem(item: InsertMenuItem): Promise<MenuItem>;

  getCartItems(): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(): Promise<void>;
  
  clearDatabase(): Promise<void>;
  fixVegNonVegClassification(): Promise<{ updated: number; details: string[] }>;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private categoryCollections: Map<string, Collection<MenuItem>>;
  private cartItemsCollection: Collection<CartItem>;
  private usersCollection: Collection<User>;
  private restaurantId: ObjectId;

  private readonly categories = [
    "nibbles",
    "soups",
    "titbits",
    "salads",
    "mangalorean-style",
    "wok",
    "charcoal",
    "continental",
    "pasta",
    "artisan-pizzas",
    "mini-burger-sliders",
    "entree-(main-course)",
    "bao-&-dim-sum",
    "indian-mains---curries",
    "biryanis-&-rice",
    "dals",
    "breads",
    "asian-mains",
    "rice-with-curry---thai-&-asian-bowls",
    "rice-&-noodles",
    "desserts",
    "blended-whisky",
    "blended-scotch-whisky",
    "american-irish-whiskey",
    "single-malt-whisky",
    "vodka",
    "gin",
    "rum",
    "tequila",
    "cognac-brandy",
    "liqueurs",
    "sparkling-wine",
    "white-wines",
    "rose-wines",
    "red-wines",
    "dessert-wines",
    "port-wine",
    "signature-mocktails",
    "soft-beverages",
    "craft-beers-on-tap",
    "draught-beer",
    "pint-beers",
    "classic-cocktails",
    "signature-cocktails",
    "wine-cocktails",
    "sangria",
    "signature-shots",
    "indian-mains---curries",
    "biryanis-rice",
    "bao-dimsum",
    "entree",
    "rice-with-curry---thai-asian-bowls",
    "oriental-starters",
    "sizzlers",
    "pizza",
    "rice-noodles",
    "gin",
    "rum",
    "vodka",
    "tequila",
    "liqueurs",
  ];

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db("barrelborn");
    this.categoryCollections = new Map();

    const categoryCollectionMapping: Record<string, string> = {
      'nibbles': 'nibbles',
      'soups': 'soups',
      'titbits': 'titbits',
      'salads': 'salads',
      'mangalorean-style': 'mangalorean-style',
      'wok': 'wok',
      'charcoal': 'charcoal',
      'continental': 'continental',
      'pasta': 'pasta',
      'artisan-pizzas': 'artisan-pizzas',
      'mini-burger-sliders': 'mini-burger-sliders',
      'entree-(main-course)': 'entree-(main-course)',
      'bao-&-dim-sum': 'bao-&-dim-sum',
      'indian-mains-curries': 'indian-mains-curries',
      'indian-mains---curries': 'indian-mains-curries',
      'biryanis-&-rice': 'biryanis-&-rice',
      'dals': 'dals',
      'breads': 'breads',
      'asian-mains': 'asian-mains',
      'rice-with-curry---thai-&-asian-bowls': 'rice-with-curry---thai-&-asian-bowls',
      'rice-&-noodles': 'rice-&-noodles',
      'desserts': 'desserts',
      'blended-whisky': 'blended-whisky',
      'blended-scotch-whisky': 'blended-scotch-whisky',
      'american-irish-whiskey': 'american-irish-whiskey',
      'single-malt-whisky': 'single-malt-whisky',
      'vodka': 'vodka',
      'gin': 'gin',
      'rum': 'rum',
      'tequila': 'tequila',
      'cognac-brandy': 'cognac-brandy',
      'liqueurs': 'liqueurs',
      'sparkling-wine': 'sparkling-wine',
      'white-wines': 'white-wines',
      'rose-wines': 'rose-wines',
      'red-wines': 'red-wines',
      'dessert-wines': 'dessert-wines',
      'port-wine': 'port-wine',
      'signature-mocktails': 'signature-mocktails',
      'soft-beverages': 'soft-beverages',
      'craft-beers-on-tap': 'craft-beers-on-tap',
      'draught-beer': 'draught-beer',
      'pint-beers': 'pint-beers',
      'classic-cocktails': 'classic-cocktails',
      'signature-cocktails': 'signature-cocktails',
      'wine-cocktails': 'wine-cocktails',
      'sangria': 'sangria',
      'signature-shots': 'signature-shots',
      'biryanis-rice': 'biryanis-rice',
      'bao-dimsum': 'bao-dimsum',
      'entree': 'entree',
      'rice-with-curry---thai-asian-bowls': 'rice-with-curry---thai-asian-bowls',
      'oriental-starters': 'oriental-starters',
      'sizzlers': 'sizzlers',
      'pizza': 'pizza',
      'rice-noodles': 'rice-noodles',
    };

    this.categories.forEach(category => {
      const collectionName = categoryCollectionMapping[category];
      if (collectionName) {
        this.categoryCollections.set(category, this.db.collection(collectionName));
      }
    });

    this.cartItemsCollection = this.db.collection("cartitems");
    this.usersCollection = this.db.collection("users");
    this.restaurantId = new ObjectId("6874cff2a880250859286de6");
  }

  async connect() {
    await this.client.connect();
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersCollection.findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const user = { ...insertUser, createdAt: now, updatedAt: now };
    const result = await this.usersCollection.insertOne(user as any);
    return { _id: result.insertedId, ...user } as any;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    const allMenuItems: MenuItem[] = [];
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      const items = await collection.find({}).toArray();
      allMenuItems.push(...items);
    }
    return this.sortMenuItems(allMenuItems);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    console.log(`[Storage] Fetching items for category: ${category}`);
    
    // Normalize category name for matching
    const normalizedCategory = category.toLowerCase().trim();
    
    // Check our explicit mapping first
    const mappedCollectionName = Array.from(this.categoryCollections.entries())
      .find(([key]) => key.toLowerCase().trim() === normalizedCategory)?.[1];
    
    let collection: Collection<MenuItem>;
    
    if (mappedCollectionName) {
      collection = mappedCollectionName;
    } else {
      console.log(`[Storage] Category ${normalizedCategory} not found in pre-defined map, searching by name...`);
      collection = this.db.collection(normalizedCategory) as Collection<MenuItem>;
    }

    try {
      // Step 0: Check the direct collection first (fastest)
      console.log(`[Storage] Checking direct collection: ${normalizedCategory}...`);
      const directItems = await collection.find({}).toArray();
      
      if (directItems.length > 0) {
        console.log(`[Storage] Found ${directItems.length} items in collection ${normalizedCategory}`);
        
        // Ensure items have the category property set correctly for the frontend
        const itemsWithCategory = directItems.map(item => ({
          ...item,
          category: item.category || normalizedCategory
        }));
        
        return this.sortMenuItems(itemsWithCategory);
      }

      // Special handling for beer categories if not found in direct collection
      const beerCategories = ['craft-beers-on-tap', 'draught-beer', 'pint-beers'];
      if (beerCategories.includes(normalizedCategory)) {
        console.log(`[Storage] Checking for beer items in 'beers' collection...`);
        const beersColl = this.db.collection('beers') as Collection<MenuItem>;
        const beerItems = await beersColl.find({ 
          category: { $regex: new RegExp(`^${normalizedCategory}$`, 'i') } 
        }).toArray();
        
        if (beerItems.length > 0) {
          console.log(`[Storage] Found ${beerItems.length} beer items in 'beers' collection`);
          return this.sortMenuItems(beerItems);
        }
      }

      // Step 0.1: Try a fallback for common variations
      if (normalizedCategory === 'pizza') {
        console.log(`[Storage] Trying fallback collection 'artisan-pizzas' for 'pizza'...`);
        const pizzaColl = this.db.collection('artisan-pizzas') as Collection<MenuItem>;
        const pizzaItems = await pizzaColl.find({}).toArray();
        if (pizzaItems.length > 0) {
          console.log(`[Storage] Found ${pizzaItems.length} items in 'artisan-pizzas'`);
          return this.sortMenuItems(pizzaItems.map(item => ({ ...item, category: 'pizza' })));
        }
      }

      // Step 1: Search across ALL collections for items with this category field
      console.log(`[Storage] Searching across all collections for category: ${normalizedCategory}...`);
      
      // Get all collection names from the database
      const dbCollections = await this.db.listCollections().toArray();
      const allMenuItems: MenuItem[] = [];
      
      const beerKeywords: Record<string, string[]> = {
        'craft-beers-on-tap': ['craft', 'tap', 'on tap'],
        'draught-beer': ['draught', 'draft'],
        'pint-beers': ['pint']
      };

      for (const collInfo of dbCollections) {
        const coll = this.db.collection(collInfo.name) as Collection<MenuItem>;
        
        const searchConditions: any[] = [
          { category: { $regex: new RegExp(`^${normalizedCategory}$`, 'i') } }
        ];

        // Add keyword matching for beer categories
        if (beerKeywords[normalizedCategory]) {
          beerKeywords[normalizedCategory].forEach(keyword => {
            searchConditions.push({ name: { $regex: new RegExp(keyword, 'i') } });
          });
        }

        const items = await coll.find({ $or: searchConditions }).toArray();
        
        if (items.length > 0) {
          console.log(`[Storage] Found ${items.length} items in collection ${collInfo.name} for category ${normalizedCategory}`);
          allMenuItems.push(...items);
        }
      }

      if (allMenuItems.length > 0) {
        console.log(`[Storage] Total found ${allMenuItems.length} items for ${normalizedCategory}`);
        return this.sortMenuItems(allMenuItems);
      }

      return [];
    } catch (error) {
      console.error(`[Storage] Error fetching items for ${normalizedCategory}:`, error);
      return [];
    }
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      const menuItem = await collection.findOne({ _id: new ObjectId(id) });
      if (menuItem) return menuItem;
    }
    return undefined;
  }

  getCategories(): string[] {
    return [...this.categories];
  }

  async addMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const collection = this.categoryCollections.get(item.category);
    if (!collection) throw new Error(`Category "${item.category}" not found`);
    const now = new Date();
    const menuItem = { ...item, restaurantId: this.restaurantId, createdAt: now, updatedAt: now, __v: 0 };
    const result = await collection.insertOne(menuItem as any);
    return { _id: result.insertedId, ...menuItem } as any;
  }

  async getCartItems(): Promise<CartItem[]> {
    return await this.cartItemsCollection.find({}).toArray();
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const menuItemId = new ObjectId(item.menuItemId);
    const existing = await this.cartItemsCollection.findOne({ menuItemId });
    if (existing) {
      const updated = await this.cartItemsCollection.findOneAndUpdate(
        { _id: existing._id },
        { $inc: { quantity: item.quantity || 1 }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return updated!;
    }
    const now = new Date();
    const cartItem = { menuItemId, quantity: item.quantity || 1, createdAt: now, updatedAt: now };
    const result = await this.cartItemsCollection.insertOne(cartItem as any);
    return { _id: result.insertedId, ...cartItem } as any;
  }

  async removeFromCart(id: string): Promise<void> {
    await this.cartItemsCollection.deleteOne({ _id: new ObjectId(id) });
  }

  async clearCart(): Promise<void> {
    await this.cartItemsCollection.deleteMany({});
  }

  async clearDatabase(): Promise<void> {
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }

  async fixVegNonVegClassification(): Promise<{ updated: number; details: string[] }> {
    return { updated: 0, details: [] };
  }

  private sortMenuItems(items: MenuItem[]): MenuItem[] {
    return items.sort((a, b) => {
      if (a.isVeg !== b.isVeg) return a.isVeg ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }
}

const connectionString = "mongodb+srv://airavatatechnologiesprojects:8tJ6v8oTyQE1AwLV@barrelborn.mmjpnwc.mongodb.net/?retryWrites=true&w=majority&appName=barrelborn";
export const storage = new MongoStorage(connectionString);
