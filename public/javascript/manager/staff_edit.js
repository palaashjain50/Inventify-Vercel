const staff_username = localStorage.getItem("staff_username")
const staff_email = localStorage.getItem("staff_email")

if(!staff_username || !staff_email) {
    toastr.error("Something went wrong")
    window.location.href = '../../html/manager/staff.html'
}
else {
    // console.log(staff_username, ", ", staff_email)
    if(staff_username) localStorage.removeItem("staff_username")
    if(staff_email) localStorage.removeItem("staff_email")

    // API CALL to get user details
    
    // document.querySelector('#uname').value = username
    // document.querySelector('#password').value = password
    // document.querySelector('#fname').value = fname
    // document.querySelector('#lname').value = lname
    // document.querySelector('#email').value = email
    // document.querySelector('#contact').value = contact
    // document.querySelector('#address').value = address
    // document.querySelector('#message').value = message
}

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

document.querySelector('.go_back_icon').addEventListener('click', () => {
    window.location.href = '../../html/manager/staff.html'
})

document.querySelector('.create_user').addEventListener('click', () => {
    // API CALL to update staff details
    const username = document.querySelector('#uname').value
    const password = document.querySelector('#password').value
    const role = "staff" 
    const fname = document.querySelector('#fname').value
    const lname = document.querySelector('#lname').value
    const email = document.querySelector('#email').value
    const contact = document.querySelector('#contact').value
    const address = document.querySelector('#address').value
    const message = document.querySelector('#message').value

    e.preventDefault()

    if(!username || !password || !role || !fname || !lname || !email || !contact || !address || !message) toastr.warning("All fields are required!")

    // API CALL (toastr.success)

    window.location.href = '../../html/manager/staff.html'    
})

document.querySelector('.cancel_to_create_user').addEventListener('click', () => {
    window.location.href = '../../html/manager/staff.html'    
})
