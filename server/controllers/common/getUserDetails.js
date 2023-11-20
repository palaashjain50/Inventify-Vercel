const dbConfigs = require('../../configs/dbConnect')

async function getUserDetails(email) {
    try {
        // console.log("In user details func ",email)
        if(!email) {
            console.log("Email required")
            return false
        }
        const client = dbConfigs.getClient
        const dbo = client.db("Inventify")
        var records = await dbo.collection("Users").find({email: email}).toArray(0)
        if(records.length === 0) {
            console.log("Account doesn't exist")
            return false
        }
        else return records
    } catch (error) {
        console.log(error)
    }
}

module.exports = getUserDetails