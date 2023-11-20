const dbConfigs = require('../../configs/dbConnect')

async function updateProfile(req, res) {
    try {
        const {email, fname, lname, contact} = req.body
        console.log(email, fname, lname, contact)
        if(!email || !fname || !lname || !contact) {
            return res.status(401).json({
                success: false,
                message: "All fields required"
            })
        }
        try {
            const client = dbConfigs.getClient
            const dbo = client.db("Inventify")
            var records = await dbo.collection("Users").find({email: email}).toArray(0)
            if(records.length === 0) return res.status(401).json({success: false, message: "Account doesn't exist for updating profile"})
            const updatedProfile =  {$set: {firstName: fname, lastName: lname, phoneno: contact}}
            dbo.collection("Users").updateOne({email: email}, updatedProfile, (err, res) => {
                if(err) console.log(err)
                else console.log("Profile updated successfully")
            })
            return res.status(200).json({
                success: true,
                message: "User updated successfully"
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Something went wrong in db Connection",
                error: error
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error
        })
    }
}

module.exports = updateProfile