const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

// Industry standard - Add all your constant variables in .env (Environment variable) 
const dotenv = require('dotenv')

// To access varibales in .env file, use dotenv.config() which loads env var in process.env object
dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))


// Connecting to Atlas
const dbConfigs = require('./server/configs/dbConnect')
dbConfigs.dbConnect()

// Import middlware
const auth = require('./server/middleware/auth') 
const authN = auth.authN
const isManager = auth.isManager
const isRetailer = auth.isRetailer
const isStaff = auth.isStaff

// ejs is a template engine which is a markup language and is converted into html file later on.
// ejs is similar to html but has superpower of calculations

// Folder structure as per industry standard - 
// A. For html pages i.e ejs files
// 1. npm i ejs
// 2. In server.js, add app.set("view engine", "ejs")
// 3. In views folder, add ejs files
// 4. Instead of send use render and add ejs file name in it.

app.set("view engine", "ejs")

// B. For static files => (images, js, css)
// 1. create a public folder
// 2. Create 3 folders inside it, images, css, javascript
// 3. Configure express static in server.js
// 4. **Understand the naming of path directory of static files in ejs
// For Exmample => In login.ejs 
// INCORRECT => <link rel="stylesheet" href="../public/css/login.css"> 
// because it is already specified that Express should serve static files from the 'public' directory. Line no. 41 in server.js 
// CORRECT => <link rel="stylesheet" href="../css/login.css">

app.use(express.static('./public'))

// -------------------------- V I S I T O R S ----------------------------------

app.get('/', (req, res) => {
    res.render('homepage')
})

app.get('/homepage', (req, res) => {
    res.render('homepage')
})

app.get('/aboutus', (req, res) => {
    res.render('aboutus')
})

app.get('/contactus', (req, res) => {
    res.render('contactus')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/signup-otp', (req, res) => {
    res.render('signup-otp')
})

// -------------------------- P R O T E C T E D - R O U T E S ----------------------------------
function decodeUser(req) {
    var token = req.cookies.token || req.header("authorization").replace("Bearer ", "")
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userInURL = req.params.username
    return userInURL === decode.username 
} 

function decodeUserDetails(req) {
    var token = req.cookies.token || req.header("authorization").replace("Bearer ", "")
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    return decode
}

// -------------------------- M A N A G E R ----------------------------------
app.get('/manager-dashboard/:username', authN, isManager, async(req, res) => {
    if(decodeUser(req) === true) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        // console.log(userDetails)
        return res.render('manager-dashboard', {manager_username: req.params.username, firstName: userDetails[0].firstName, lastName: userDetails[0].lastName})
    }
    else return res.render('page_not_found')
})

const getUserDetails = require('./server/controllers/common/getUserDetails')
app.get('/manager-profile/:username', authN, isManager, async(req, res) => {
    if(decodeUser(req) === true) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        console.log(userDetails)
        // full name => (userDetails[0].firstName+userDetails[0].lastName).replace(/\s/g, ''),
        return res.render('manager-profile', {
            manager_username: userDetails[0].username,
            manager_firstName: userDetails[0].firstName,
            manager_lastName: userDetails[0].lastName,
            manager_email: userDetails[0].email,
            manager_contact: userDetails[0].contact,
            manager_gender: userDetails[0].gender,
            manager_doj: userDetails[0].dateOfJoining
        }
        )
    }
    else return res.render('page_not_found')
})


const getStaffDetails = require('./server/controllers/manager/getStaffDetails')
app.get('/get-staff-details/:username', authN, isManager, async(req, res) => {
    if(decodeUser(req) === true) {
        try {
            const staff_records = await getStaffDetails(req)
            if(staff_records.success) res.render('get-staff-details', {
                    manager_username: req.params.username, 
                    staff_data: staff_records.data
                }
            )
            return res.render('get-staff-details')
        } catch (error) {
            console.log("Error while fetching staff details")
        }
    }
    else return res.render('page_not_found')
})

const getProductDetails = require('./server/controllers/common/getProductDetails')
app.get('/manager-products/:username', async(req, res) => {
    if(decodeUser(req) === true) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        let productDetails = await getProductDetails()
        console.log(productDetails)
        res.render('manager-products', {
            manager_username: req.params.username, 
            firstName: userDetails[0].firstName, 
            lastName: userDetails[0].lastName,
            products: productDetails
        })

    }
    
})

// const orderApproval = require('./server/controllers/manager/orderApproval')
app.get('/manager-approval/:username', async(req, res) => {
    if(decodeUser(req) === true) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        let data = await orderApproval()
        console.log(data)
        return res.render('manager-approval', {
            manager_username: req.params.username, 
            firstName: userDetails[0].firstName, 
            lastName: userDetails[0].lastName,
            orderApproval: data.data
        })
    }
    else return res.render('page_not_found')
})

const approvalStatus = require('./server/controllers/manager/approvalStatus')
app.post('/update-approval-status/:username', async(req, res) => {
    if(decodeUser(req)) {
        const response = await approvalStatus(req)
        if(response.success) {
            return res.status(200).json({
                res: response
            })
        }
        else return res.status(500).json({
            response
        })
    }
    else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized error'
        })
    }
})

// -------------------------- S T A F F ----------------------------------
app.get('/staff-dashboard/:username', authN, isStaff, async(req, res) => {
    if(decodeUser(req) === true) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        // console.log(userDetails)
        return res.render('staff-dashboard', {staff_username: req.params.username, firstName: userDetails[0].firstName, lastName: userDetails[0].lastName})
    }
    else return res.render('page_not_found')
})

app.get('/staff-profile/:username', authN, isStaff, async(req, res) => {
    if(decodeUser(req) === true) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        console.log(userDetails)
        console.log(userDetails[0].dateofJoining)
        // full name => (userDetails[0].firstName+userDetails[0].lastName).replace(/\s/g, ''),
        return res.render('staff-profile', {
            username: userDetails[0].username,
            firstName: userDetails[0].firstName,
            lastName: userDetails[0].lastName,
            email: userDetails[0].email,
            contact: userDetails[0].contact,
            gender: userDetails[0].gender,
            doj: userDetails[0].dateofJoining
        }
        )
    }
    else return res.render('page_not_found')
})

const getOrderDetails = require('./server/controllers/staff/getOrderDetails')
app.get('/staff-orders/:username', authN, isStaff, async(req, res) => {
    if(decodeUser(req) === true) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        let orderDetails = await getOrderDetails()
        console.log(orderDetails)
        if(orderDetails.success) {
                return res.render('staff-orders', {
                    staff_username: req.params.username, 
                    firstName: userDetails[0].firstName, 
                    lastName: userDetails[0].lastName,
                    orderDetails: orderDetails.data
                }
            )
        }
        else res.send("Can't fetch order details :(")
        
    }
    else return res.render('page_not_found')
})

const updateProductStatus = require('./server/controllers/staff/updateProductStatus')
app.post('/update-product-status/:username', authN, isStaff, async(req, res) => {
    // console.log(req.body)
    if(decodeUser(req)) {
        const response = await updateProductStatus(req)
        if(response.success) {
            return res.status(200).json({
                res: response
            })
        }
        else return res.status(500).json({
            res: response
        })
    }
    else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized error'
        })
    }
})


// -------------------------- R E T A I L E R  ----------------------------
app.get('/retailer-dashboard/:username', authN, isRetailer, async(req, res) => {
    if(decodeUser(req))  {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        console.log(userDetails)
        return res.render('retailer-dashboard', {retailer_username: req.params.username, firstName: userDetails[0].firstName, lastName: userDetails[0].lastName})
    }
    
    else return res.render('page_not_found')
})

app.get('/retailer-profile/:username', authN, isRetailer, async(req, res) => {
    if(decodeUser(req) === true) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        console.log(userDetails)
        console.log(userDetails[0].dateofJoining)
        // full name => (userDetails[0].firstName+userDetails[0].lastName).replace(/\s/g, ''),
        return res.render('retailer-profile', {
            username: userDetails[0].username,
            firstName: userDetails[0].firstName,
            lastName: userDetails[0].lastName,
            email: userDetails[0].email,
            contact: userDetails[0].phoneno,
            gender: userDetails[0].gender,
            doj: userDetails[0].dateofJoining
        }
        )
    }
    else return res.render('page_not_found')
})

app.get('/retailer-products/:username', authN, isRetailer, async(req, res) => {
    if(decodeUser(req)) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        let productDetails = await getProductDetails()
        // console.log(productDetails)
        res.render('retailer-products', {
            username: userDetails[0].username,
            products: productDetails
        })
        // res.status(200).json({
        //     username: userDetails[0].username,
        //     products: productDetails
        // })
    }
    else return res.render('page_not_found')
})

app.get('/retailer-cart/:username', authN, isRetailer, async(req, res) => {
    if(decodeUser(req)) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        return res.render('retailer-cart', {
            username: userDetails[0].username,
            firstName: userDetails[0].firstName,
            lastName: userDetails[0].lastName,
        })
    }
})

app.post('/get-cart-items/:username', authN, isRetailer, async(req, res) => {
    // console.log(req.body)
    if(decodeUser(req)) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        let productDetails = await getProductDetails(req.body.cart)
        // console.log(productDetails)
        return res.status(200).json({
            success: true,
            data: productDetails,
            
        })
    }
    else return res.render('page_not_found')
})

// To place order
const order = require('./server/controllers/retailer/order')
app.post('/order-items/:username', authN, isRetailer, async(req, res) => {
    console.log(req.body)
    if(decodeUser(req)) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        const orderStatus = await order(req, req.params.username)
        if(orderStatus.success) {
            return res.status(200).json({
                success: true,
                messsage: "Order Placed Successfully",
                data: orderStatus.data                
            })
        }
        else {
            return res.status(500).json({
                success: false,
                error: orderStatus.error
            })
        }
        
    }
    else return res.render('page_not_found')
})

// To check ordered status 
const orderProducts = require('./server/controllers/retailer/orderProducts')
app.get('/retailer-orders/:username', authN, isRetailer, async(req, res) => {
    if(decodeUser(req)) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        let productsOrder = await orderProducts(userDetails[0].username)
        return res.render('retailer-orders', {
            username: userDetails[0].username,
            firstName: userDetails[0].firstName,
            lastName: userDetails[0].lastName,
            productsOrder: productsOrder.productsOrderByRetailer
        })
    }
    else return res.render('page_not_found')
})


// -------------------------------------------------------------------------------

app.get('/clear-db', async(req, res) => {
    try {
        const client = dbConfigs.getClient
        const dbo = client.db("Inventify")
        dbo.collection("Orders").deleteMany({})
        res.send("Orders Collection cleared!")
    } catch (error) {
        console.log(error)
        res.send("Error")
    }
})

// -------------------------- A P I ------------------------------------------

const loginHandler = require('./server/controllers/visitors/login')
app.post('/login', loginHandler)

const signup = require("./server/controllers/visitors/signUp");
app.post('/signup', (req, res) => {
    signup(req, res);
})

const signUpWithGoogle = require('./server/controllers/visitors/signUpWithGoogle');
app.post('/signup-with-google', signUpWithGoogle);

const genOTP = require("./server/controllers/visitors/generateOTP")
app.post('/get-otp', (req, res) => {
    return genOTP(req, res)
})

const updateProfile = require('./server/controllers/common/updateProfile')
const orderApproval = require('./server/controllers/manager/orderApproval')
app.post('/update-profile', authN, updateProfile)

app.post("/logout", (req, res) => {
    res.clearCookie('token')
    res.json({"success": true})
})

// -------------------------- E R R O R - 4 0 4 ----------------------------------

app.get('*', (req, res) => {
    res.render('page_not_found')
})

app.listen(PORT, () => {
    console.log("Server activated on PORT", PORT)
})

module.exports = app