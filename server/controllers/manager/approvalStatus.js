const dbConfigs = require('../../configs/dbConnect')
const { ObjectId } = require('mongodb');
const { notifyRetailer } = require('../../configs/sendMail');

const client = dbConfigs.getClient
const dbo = client.db("Inventify")

async function approvalStatus(req) {
    try {
        const {transactionID, status, username} = req.body
        // console.log(req.body)
        try {
            // console.log(typeof transactionID)
            var findTransactionID = await dbo.collection("Orders").findOne({
                _id: new ObjectId(transactionID)
            });
            // console.log(findTransactionID)
            if(!findTransactionID) {
                return {
                    success: false,
                    message: "Invalid Transaction ID, product quantites can't be updated!"
                }
            }
            var updatedOrder = await dbo.collection("Orders").updateOne(
                { _id: new ObjectId(transactionID) },
                { $set: 
                    { 
                        status: status,
                        manager: username
                    },
                },
                (error) => console.log(error)
            )
            // console.log("Document updated successfully")
            updateProductQuantities(transactionID);
            return {
                success: true,
                data: updatedOrder,
                message: "Product Quantites updated successfully and retailer is notified!"
            }
        } catch (error) {
            return {
                success: false,
                error: error
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
}

async function updateProductQuantities(transactionID) {
    let products = await dbo.collection("Orders").findOne({
        _id: new ObjectId(transactionID)
    });
    let email = products.email;
    products = products.products;
    for (const product of products) {
        const prevProduct = await dbo.collection("Products").findOne({
            id: parseInt(product.productID)
        });
        await dbo.collection("Products").updateOne({
            id: parseInt(product.productID)
        }, {
            $set: {
                quantity: prevProduct.quantity - parseInt(product.qtyStrip)
            }
        });
    }
    notifyRetailer(email, transactionID);
}

module.exports = approvalStatus