const dbConfigs = require('../../configs/dbConnect')

async function getOrderDetails() {
    try {
        const client = dbConfigs.getClient
        const dbo = client.db("Inventify")
        let orders = await dbo.collection("Orders").find().toArray()
        return {
            success: true,
            data: orders
        }
    } catch (error) {
        return {
            success: false,
            error: err
        }
    }
}

module.exports = getOrderDetails