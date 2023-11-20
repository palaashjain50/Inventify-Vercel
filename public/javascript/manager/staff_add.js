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
}

document.querySelector('.go_back_icon').addEventListener('click', () => {
    window.location.href = '../../html/manager/staff.html'
})

document.querySelector('.cancel_to_create_user').addEventListener('click', () => {
    // to refresh page
    location.reload()
})


document.querySelector('.create_user').addEventListener('click', (e) => {
    const username = document.querySelector('#uname').value
    const password = document.querySelector('#password').value
    const role = "staff" 
    const fname = document.querySelector('#fname').value
    const lname = document.querySelector('#lname').value
    const email = document.querySelector('#email').value
    const contact = document.querySelector('#contact').value
    const address = document.querySelector('#address').value
    const message = document.querySelector('#message').value
    
    console.log(username, password, role, fname, lname, email, contact, address, message)
    
    e.preventDefault()

    if(!username || !password || !role || !fname || !lname || !email || !contact) toastr.warning("All fields are required!")

    // API CALL
    addStaff(username, password, role, fname, lname, email, contact, address, message)

})

async function addStaff(username, password, role, fname, lname, email, contact, address, message) {
    try {
        const token = localStorage.getItem("token")
        const response = await fetch('http://localhost:3000/api/create_staff/', {
            method: "POST",
            body: JSON.stringify({
                username: username, password: password, role: role, fname: fname, lname: lname, email: email, contact: contact, address: address, message: message
            }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json()
        console.log(data)
        if(data.success) {
            toastr.success("Account created Successfully")
            window.location.href = '../../html/manager/staff.html'
        }
        else if(data.flag == 1) {
            toastr.warning("Account already exists")
        }
        else {
            toastr.error("Something went wrong")
        }
        
    } catch (error) {
        console.log("Error during account creation of staff on client side")
        console.log(error)
    }
}




