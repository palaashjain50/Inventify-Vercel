const dbConfigs = require('../../configs/dbConnect')
const bcrypt = require('bcrypt')

async function createStaff(req, res) {
    try {
        
        const {username, password, role, fname, lname, email, contact, address, message} = req.body
        if(!username || !password || !role || !fname || !lname || !email || !contact) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }
        else {
            try {
                const client = dbConfigs.getClient
                const dbo = client.db("Inventify")
                 
                const staff = await dbo.collection("Users").find({email : email}).toArray()
                
                if(staff.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Staff already exist",
                        flag: 1
                    })
                }
                else if(staff.length === 0) {
                    var hashedPassword = await bcrypt.hash(password, 10)

                    dbo.collection("Users").insertOne({
                        "name": username,
                        "firstName": fname,
                        "lastName": lname,
                        "email": email,
                        "phoneno": contact,
                        "pass": hashedPassword,
                        "role": role
                    })

                    // send email to corresponding staff member

                    return res.status(200).json({
                        success: true,
                        message: "Staff account created successfully"
                    })
                        
                }

            } catch (error) {
                console.log(err.stack)
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong in db Connection",
                    error: err
                })
            }
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while creating staff account",
            error: error
        })
    }
}

module.exports = createStaff