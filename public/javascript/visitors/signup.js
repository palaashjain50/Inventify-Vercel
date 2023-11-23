toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-center",
    "onclick": null,
    "showDuration": "100",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "show",
    "hideMethod": "hide"
};

document.querySelector("#button").onclick = async (e) => {
    const fname = document.querySelector("#name").value
    const phoneno = document.querySelector("#phoneno").value
    const email = document.querySelector("#email").value
    const fpasswd = document.querySelector("#fpasswd").value
    const spasswd = document.querySelector("#spasswd").value

    e.preventDefault();
    
    if(!fname || !phoneno || !email || !fpasswd || !spasswd) toastr.warning("All fields are required!")
    console.log(fname, phoneno, email, fpasswd, spasswd)
    // Display an info toast with no title
    if(fpasswd !== spasswd) {
        toastr.error("Password doesn't match")
    }
    else {
        // get-otp
        const response = await fetch("https://inventify-render.onrender.com/get-otp", {
            method: "POST",
            body: JSON.stringify({
                email: email,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        console.log(response);
        const data = await response.json()
        console.log(data)
        if(data.success) {
            window.location.href = '/signup-otp'
            
            const credentials = {
                fname: fname,
                phoneno: phoneno,
                email: email,
                fpasswd: fpasswd,
                spasswd: spasswd,
            };

            localStorage.setItem("credentials", JSON.stringify(credentials))

            // const response = await fetch("http://localhost:5500/signup", {
            //     method: "POST",
            //     body: JSON.stringify(credentials),
            //     headers: {
            //         "Content-type": "application/json; charset=UTF-8"
            //     }
            // });

            // console.log(response);
        }
        
    }
}

async function handleCredentialResponse(obj) {
    const response = await fetch("https://inventify-render.onrender.com/signup-with-google", {
        method: "POST",
        body: JSON.stringify({
            credential: obj.credential
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        }        
    });
    const message = await response.json();
    if (message.success) {
        localStorage.setItem("token", message.token);
        localStorage.setItem("role", message.role);
        localStorage.setItem("username", message.username);
        window.location.href = `/retailer-dashboard/${message.username}`;
    }
    else {
        console.log("Error! Please try again!");
    }
}

