const dbConfigs = require('../../configs/dbConnect')
const { ObjectId } = require('mongodb');

async function updateProductStatus(req) {
    try {
        const {transactionID, status} = req.body
        try {
            const client = dbConfigs.getClient
            const dbo = client.db("Inventify")
            console.log(typeof transactionID)
            if(status === 'In Approval') {
                const updatedOrder = await dbo.collection("Orders").updateOne(
                    { _id: new ObjectId(transactionID) },
                    { $set: 
                        { 
                            status: status,
                            staff: req.body.staff_username
                        },
                    },
                    (error) => console.log(error)
                )
            }
            else if(status === 'Discard') {
                const updatedOrder = await dbo.collection("Orders").updateOne(
                    { _id: new ObjectId(transactionID) },
                    { $set: 
                        { 
                            status: status,
                            staff: req.body.staff_username
                        },
                    },
                    (error) => console.log(error)
                )
            }
            
            console.log("Document updated successfully")
            return {
                success: true,
                data: updatedOrder
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

module.exports = updateProductStatus