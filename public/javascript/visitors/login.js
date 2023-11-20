const lightblue = "#96B9FF"
const darkblue = "#071E41"

const roles = document.querySelectorAll('.role')
roles[0].style.backgroundColor = `${lightblue}`
roles[0].style.color = `${darkblue}`
roles[0].style.opacity = "1"
roles[0].style.fontWeight = "900"

var roleType = "Admin"

roles.forEach((role) => {
    role.addEventListener('click', () => {
        for(var i = 0; i < roles.length; i++) {
            roles[i].style.backgroundColor = `${darkblue}`
            roles[i].style.color = `#fff`
            roles[i].style.opacity = "0.6"
            roles[i].style.fontWeight = "400"
        }
        role.style.backgroundColor = `${lightblue}`
        role.style.color = `${darkblue}`
        role.style.opacity = "1"
        role.style.fontWeight = "900"
        roleType = role.textContent
    })
})

// ------------------------------------------------------------------------------------------------

const token = localStorage.getItem('token')
if(token) {
    const role = localStorage.getItem('role').toLowerCase()
    console.log(role) 

    if(role === "manager") {
            // Assuming you have the manager's username in a variable
        const managerUsername = localStorage.getItem('username');
        // Redirect to the dashboard page with the username parameter
        window.location.href = `/manager-dashboard/${managerUsername}`;
    }
    else if(role === "retailer") {
        // Assuming you have the manager's username in a variable
        const retailerUsername = localStorage.getItem('username');
        // Redirect to the dashboard page with the username parameter
        window.location.href = `/retailer-dashboard/${retailerUsername}`;
    }
    else if(role === "staff") {
        // Assuming you have the manager's username in a variable
        const staffUsername = localStorage.getItem('username');
        // Redirect to the dashboard page with the username parameter
        window.location.href = `/staff-dashboard/${staffUsername}`;
    }
    else if(role === "admin") {
        // Assuming you have the manager's username in a variable
        const adminUsername = localStorage.getItem('username');
        // Redirect to the dashboard page with the username parameter
        window.location.href = `/admin-dashboard/${adminUsername}`;
    }
}
else console.log("You have to login !. Token is missing :(")


submit.addEventListener('click', (e) => {
    const username = document.querySelector("#username")
    const password = document.querySelector("#password")
    
    e.preventDefault()
    // console.log(username.value)
    // console.log(password.value)
    // console.log(roleType)

    // validation on frontend 
    if(!username.value || !password.value || !roleType) {
        console.log("All fields are required")
    }
    else {
        // API call
        login(username.value, password.value, roleType)
    }
})

async function login(email, password, roleType) {
    try {
        const response = await fetch('http://localhost:5500/login/', {
            method: "POST",
            body: JSON.stringify(
                {
                    email: email,
                    password: password,
                    role: roleType
                }
            ),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })  
        // console.log(response)
        
        const data = await response.json()
        console.log(data)
        if(data.success) {
            localStorage.setItem("token", data.token)
            localStorage.setItem("role", data.role)
            localStorage.setItem("username", data.username)
        }
        const token = localStorage.getItem('token')
        if(token) {
            const role = localStorage.getItem('role').toLowerCase()
            console.log(role) 

            if(role === "manager") {
                 // Assuming you have the manager's username in a variable
                const managerUsername = localStorage.getItem('username');
                // Redirect to the dashboard page with the username parameter
                window.location.href = `/manager-dashboard/${managerUsername}`;
            }
            else if(role === "retailer") {
                const retailerUsername = localStorage.getItem('username');
                window.location.href = `/retailer-dashboard/${retailerUsername}`;
            }
            else if(role === "staff") {
                const staffUsername = localStorage.getItem('username');
                window.location.href = `/staff-dashboard/${staffUsername}`;
            }
            else if(role === "admin") {
                const adminUsername = localStorage.getItem('username');
                window.location.href = `/admin-dashboard/${adminUsername}`;
            }
        }
    
    } catch (error) {
        console.log("Error during login on client side")
        console.log(error)
    }
}

async function handleCredentialResponse(obj) {
    const response = await fetch("http://localhost:5500/signup-with-google", {
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

