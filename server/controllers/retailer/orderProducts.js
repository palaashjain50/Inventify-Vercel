const e = require('express')
const dbConfigs = require('../../configs/dbConnect')

async function orderProducts(username) {
    try {
        if(!username) return {
            success: false,
            error: "All fields required"
        }
        else {
            try {
                const client = dbConfigs.getClient
                const dbo = client.db("Inventify")
                const productsOrderByRetailer = await dbo.collection("Orders").find({username : username}).toArray()
                return {
                    success: true,
                    productsOrderByRetailer: productsOrderByRetailer
                }
            } catch (error) {
                return {
                    success: false,
                    error: err
                }
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
}

module.exports = orderProducts