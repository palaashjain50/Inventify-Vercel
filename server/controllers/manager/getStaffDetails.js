const dbConfigs = require('../../configs/dbConnect')

async function getStaffDetails(req) {
    try {
        const client = dbConfigs.getClient
        const dbo = client.db("Inventify")
        const staff_details = await dbo.collection("Users").find({role: "staff"}).toArray()
        console.log(staff_details)
        return ({
            success: true,
            data: staff_details,
        })
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Something went wrong while fetching staff details",
            err: error
        }
    }
}

module.exports = getStaffDetails