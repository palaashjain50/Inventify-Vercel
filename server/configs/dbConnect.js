const { MongoClient, ObjectId } = require("mongodb")
const dotenv = require('dotenv')

dotenv.config()
// Replace the following with your Atlas connection string                                                                                                                                        
const url = process.env.DATABASE_URL

// Connect to your Atlas cluster
const client = new MongoClient(url)

async function dbConnect() {
    try {
        await client.connect()
        console.log("Successfully connected to Atlas");
        // console.log("Checking Inventory Status...");
        // reorderPoint();
    } catch (err) {
        console.log(err.stack)
    }
}

async function reorderPoint() {
    const db = client.db("Inventify");
    const products = await db.collection("Products").find().toArray();
    let reorder = [];
    products.forEach(product => {
        if (product.quantity <= product.minimum_stock_level) {
            reorder.push(product.name);
        }
    });
    console.log(reorder);
    const mailingOptions = require('./sendMail');
    if (reorder.length !== 0) {
        mailingOptions.alertManager(reorder);
    }
}

module.exports = {
    dbConnect,
    getClient: client,
};
