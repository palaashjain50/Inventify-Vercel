const dbConfigs = require('../../configs/dbConnect')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

async function login(req, res) {
    try {
        const {email, password, role} = req.body
        // console.log(email, password, role)
        if(!email || !password || !role) {
            return res.status(401).json({
                success: false,
                message: "All fields required"
            })
        }
        else {
            // db connection is async hence try - catch block for error handling
            try {
                const client = dbConfigs.getClient
                const dbo = client.db("Inventify") //Connecting to "Inventify" DB in Atlas

                var records = await dbo.collection("Users").find({email: email}).toArray(0)
                if(records.length == 0) {
                    return res.status(401).json({
                        success: false,
                        message: "Account doesn't exist",
                    })
                }
                console.log(records)
                var hashedPass = records[0].pass
                
                // Comparing password
                if(await bcrypt.compare(password, hashedPass)) {
                    // JWT Token
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
                    
                    const signature_data = {
                        email: records[0].email,
                        id: records[0]._id,
                        role: records[0].role,
                        username: records[0].username
                    }

                    // When you create a JWT (JSON Web Token) with the same payload and the same 
                    // secret key multiple times, it will produce the same token each time. 
                    
                    const token = jwt.sign(signature_data, JWT_SECRET_KEY, {expiresIn: "24h"})

                    // Set cookie for token and return success response
                    const options = {
                        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        httpOnly: true,
                    }

                    res.cookie("token", token, options).status(200).json({
                        success: true,
                        token,
                        username: records[0].username,
                        role: role,
                        message: `User Login Success`,
                    });
                
                    // return res.status(200).json({
                    //     success: true, 
                    //     token: token, 
                    //     username: records[0].name,
                    //     role: role
                    // })
                }
                else {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid Password",
                        error: error
                    })
                }
                
            } catch (error) {
                console.log(error.stack)
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong in db Connection",
                    error: error
                })
            }
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

module.exports = login