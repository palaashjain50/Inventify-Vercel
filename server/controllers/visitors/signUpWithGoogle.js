const jwt = require("jsonwebtoken");
const client = require('../../configs/dbConnect').getClient;
const dotenv = require('dotenv');

async function signUpWithGoogle(req, res) {
    try {
        let { credential } = req.body;
        credential = jwt.decode(credential);
        const user = await client.db("Inventify").collection("Users").findOne({email: credential.email});
        let id, username;
        if (user) {
            console.log("User Already Exists");
            id = user._id;
            username = user.username;
        }
        else {
            console.log("Creating A New User...");
            let tempUserName = "Retailer-" + Math.ceil(Math.random() * 100);
            const RES = await client.db("Inventify").collection("Users").insertOne({
                email: credential.email,
                name: credential.name,
                picture: credential.picture,
                role: "retailer",
                username: tempUserName,
                dateOfJoining: new Date()
            });
            console.log("New User Created");
            id = RES.insertedId;
            username = tempUserName;
        }
        const token = jwt.sign({
            email: credential.email,
            id: id,
            role: "retailer",
            username: username
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h"
        });
        res.cookie("token", token, {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }).status(200).json({
            success: true,
            token,
            username: username,
            role: "retailer",
            message: "Sign Up with google successful"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while signing up with google",
            err: error
        })
    }
}

module.exports = signUpWithGoogle