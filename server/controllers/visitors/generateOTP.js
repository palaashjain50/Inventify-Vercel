const otpGenerator = require('otp-generator')
const sendMail = require('../../configs/sendMail')
const dbConfigs = require('../../configs/dbConnect')

async function generateOTP(req, res) {
    const userEmail = req.body.email
    // console.log(req.body)
    if(!userEmail) {
        return res.status(401).json({
            success: false,
            message: "Email address missing!"
        })
    }
    else {
        try {
            const client = dbConfigs.getClient
            const dbo = client.db("Inventify") //Connecting to "Inventify" DB in Atlas
            var records = await dbo.collection("Users").find({email: userEmail}).toArray(0)
            if(records.length === 0) {
                let otp = otpGenerator.generate(6, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                })
                // Create a TTL index for automatic document expiration after 1 minute
                
                await dbo.collection("OTP").createIndex({ "expireAt": 1 }, { expireAfterSeconds: 0 });

                const expirationTimestamp = new Date();
                expirationTimestamp.setMinutes(expirationTimestamp.getMinutes() + 1); // Set the expiration time to 1 minute from now
                const OTPrecords = await dbo.collection("OTP").find({ email: userEmail }).toArray();
                if (OTPrecords.length > 0) {
                // If the user's email already exists in the collection, update the OTPs array
                await dbo.collection("OTP").updateOne(
                            { email: userEmail },
                            {
                                $push: {
                                    otpArray: {
                                        otp: otp,
                                        expireAt: expirationTimestamp
                                    }
                                }
                            },
                            {expireAt: expirationTimestamp}
                        );
                } 
                else{
                // If the user's email does not exist, create a new document with an array of OTPs
                    const otpBody = await dbo.collection("OTP").insertOne(
                                    {
                                        "email": userEmail,
                                        "otpArray": [
                                            {
                                                otp: otp,
                                                expireAt: expirationTimestamp
                                            }
                                        ],
                                        "expireAt": expirationTimestamp
                                    }
                                );
                    // console.log(otpBody);
                }

                // Send Mail
                sendMail.sendMail(userEmail, otp)

                return res.status(200).json({
                    success: true,  
                    message: 'OTP sent successfully!',
                })
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: "Account already exists!"
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
}

module.exports = generateOTP