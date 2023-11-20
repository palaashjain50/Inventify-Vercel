const dbConfigs = require('../../configs/dbConnect')

async function order(req, username){
    try {
        
        const {fname, lname, contact, email, address, address2, city, zip, products, productAmount, shippingFee, totalAmount} = req.body
        if(!fname || !lname || !contact || !email || !address || !city || !zip || !products || !productAmount || !shippingFee || !totalAmount) {
            return {
                success: false,
                error: "All fields required"
            }
        }
        else {
            try {
                const client = dbConfigs.getClient
                const dbo = client.db("Inventify")
                const orderDetail = dbo.collection("Orders").insertOne({
                    "username": username,
                    "firstName": fname,
                    "lastName": lname,
                    "email": email,
                    "phoneno": contact,
                    "address": address,
                    "address2": address2,
                    "orderCreatedAt": new Date(),
                    "status": "Pending",
                    "products": products,
                    "shippingFee": shippingFee,
                    "totalAmount": totalAmount,
                    "manager": "--",
                    "staff": "--"
                })

                return {
                    success: true,
                    data: orderDetail
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

module.exports = order