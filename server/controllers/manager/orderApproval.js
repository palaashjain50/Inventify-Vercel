const dbConfigs = require('../../configs/dbConnect')

async function orderApproval(req, res) {
    try {
        const client = dbConfigs.getClient
        const dbo = client.db("Inventify")
        const approvalRequest = await dbo.collection("Orders").find({status: "In Approval"}).toArray()
        return {
            success: true,
            data: approvalRequest
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
}

module.exports = orderApproval