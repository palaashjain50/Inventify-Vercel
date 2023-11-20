const dbConfigs = require('../../configs/dbConnect')
const bcrypt = require('bcrypt')

async function signUp(req, res) {
    try {
        const {fname, phoneno, email, fpasswd, spasswd, otp} = req.body.credentials
        // console.log(req.body)
        if(!fname || !phoneno || !email || !fpasswd || !spasswd || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if(fpasswd !== spasswd) {
            return res.status(400).json({
                success: false,
                message: "Password doesn't match"
            })
        } 

        try {
            const client = dbConfigs.getClient
            const dbo = client.db("Inventify")

            var OTPrecords = await dbo.collection("OTP").find({email: email}).toArray()
            // console.log("OTP RECORDS => ",OTPrecords[0].otpArray)
            if(OTPrecords[0].otpArray.length > 0) {
                var OTPArr = OTPrecords[0].otpArray
                // console.log(OTPArr[1])
                const recentOTP = OTPArr[OTPArr.length - 1].otp
                // console.log(recentOTP, otp)
                if(otp !== recentOTP) return res.status(400).json({
                    success: false,
                    message: "OTP doesn't match"
                })
            }
            else if(OTPrecords.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "OTP doesn't exists"
                })
            }

            const listCollections = await dbo.listCollections().toArray()
            const collections = listCollections.map((collectionName) => collectionName.name)

            var flag = true
            for(const coll in collections) {
                if(collections[coll] == 'Users') flag = false
            }

            if(flag) {
                dbo.createCollection("Users", (err, res) => {
                    if(err) throw err
                    console.log("Users collection created")
                })
            }
            else {
                const records = await dbo.collection("Users").find({}).toArray()
                records.forEach(obj => {
                    if(obj.email === email) {
                        flag = true                            
                    }
                });
                if(flag) {
                    return res.status(400).json({
                        success: false,
                        message: "User already exist"
                    })
                }
            }

            const hashPassword = await bcrypt.hash(fpasswd, 10)

            dbo.collection("Users").insertOne(
                {
                    "firstName": fname.split(" ")[0],
                    "lastName": fname.split(" ")[1],
                    "email": email,
                    "phoneno": phoneno,
                    "pass": hashPassword,
                    "role": "retailer",
                    "dateofJoining": new Date(),
                    "gender": "--",
                    "username": `Retailer-048`
                }
            )
            return res.status(200).json({
                success: true,
                message: "Signup was successfull!",
            })
            
        } catch (err) {
            console.log(err.stack)
            return res.status(500).json({
                success: false,
                message: "Something went wrong in db Connection",
                error: err
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while signing up",
            error: error
        })
    }
}

module.exports = signUp