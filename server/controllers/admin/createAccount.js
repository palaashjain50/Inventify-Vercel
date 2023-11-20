const dbConfigs = require('../../configs/dbConnect')
const bcrypt = require('bcrypt')

async function createAccount(req, res) {
    try {
        console.log("In create account controller")
        const {username, password, role, fname, lname, email, contact} = req.body
        console.log(username, password, role)
        return res.status(200).json({
            success: true,
            message: "Account created successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while creating account",
            error: error
        })
    }
}

module.exports = createAccount