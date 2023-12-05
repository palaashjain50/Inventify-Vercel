const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

async function authN(req, res, next) {

    // console.log(req.headers)

    var token = req.cookies.token;
    if (!token) {
        var auth_header = req.header("authorization");
        if (auth_header) {
            auth_header = auth_header.replace("Bearer ", "");
            token = auth_header;   
        }
    }
    console.log("Token => ",token)
    if(!token) return res.status(400).json({
        success: false,
        message: "Token missing!"
    })
    else {
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
            console.log("User accessing route is (decode) => ",decode)
            req.user = decode
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:'Token is invalid',
            });
        }
        next() //continue to protected route
    }
}

function isAdmin(req, res, next) {
    if(req.user.role !== "admin") {
        return res.status(401).json({
            success: false,
            message: "This is a protected route for admin only"
        })
    }
    else console.log("isAdmin")
    next()
}

function isManager(req, res, next) {
    if(req.user.role !== "manager") {
        return res.status(401).json({
            success: false,
            message: "This is a protected route for manager only"
        })
    }
    else console.log("isManager")
    next()
}

function isStaff(req, res, next) {
    if(req.user.role !== "staff") {
        return res.status(401).json({
            success: false,
            message: "This is a protected route for staff only"
        })
    }
    else console.log("isStaff")
    next()
}

function isRetailer(req, res, next) {
    if(req.user.role !== "retailer") {
        return res.status(401).json({
            success: false,
            message: "This is a protected route for retailer only"
        })
    }
    else console.log("isRetailer")
    next()
}

module.exports = {authN, isAdmin, isManager, isStaff, isRetailer}
