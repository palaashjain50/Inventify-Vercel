const nodemailer = require('nodemailer')

function createTransport() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "testerjain3575@gmail.com",
            //   pass: "tiuy uczf uusb qzos"
          pass: "xulw qvgc mfjd prfe"
        }
    })
}

let transporter = createTransport();

function sendMail(userEmail, otp) {
    let mailOptions = {
        from: "testerjain3575@gmail.com",
        to: userEmail,
        subject: 'Inventify Project',
        html: `<div>
                Hello From Inventify !
                <h1>Your OTP is ${otp}</h1>
            </div>`,
    }
    
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    })
}

function alertManager(reorder) {
    let tableContent = `<table style="border-collapse: collapse;">`;
    reorder.forEach(product => {
        tableContent += `<tr><td style="border: 2px solid #000; padding: 8px;">${product}</td></tr>`
    });
    tableContent += `</table>`;
    console.log(tableContent);
    let mailOptions = {
        from: "testerjain3575@gmail.com",
        to: "inventify.org@gmail.com",
        subject: 'Reorder Products!',
        html: tableContent,
    }
    
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Manager Notified!");
        }
    })
}

// sendMail()

module.exports = { sendMail, alertManager };