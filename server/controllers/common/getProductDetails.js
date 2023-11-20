const dbConfigs = require('../../configs/dbConnect')

async function getProductDetails(product_id) {
    try {
        console.log(product_id)
        const client = dbConfigs.getClient  
        const dbo = client.db("Inventify")
        var records = []
        if(!product_id) records = await dbo.collection("Products").find({}).toArray(0)
        else {
            for(let i = 0; i < product_id.length; i++) {
                let cartItems = await dbo.collection("Products").find({id: parseInt(product_id[i])}).toArray(0) 
                records.push(cartItems)
            }
        }
        return records
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "DB connection error"
        })
    }
}

module.exports = getProductDetails