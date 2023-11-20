document.querySelector('.add_user').addEventListener('click', () => {
    window.location.href = '../../html/manager/staff_add.html'
})

const edits = document.querySelectorAll('.edit')
const staff_username = document.querySelectorAll('.staff_username')
const staff_email = document.querySelectorAll('.staff_email')
const staff_contact = document.querySelectorAll('.staff_contact') 

edits.forEach((edit, idx) => {
    edit.addEventListener('click', () => {
        console.log(staff_username[idx].textContent, staff_email[idx].textContent, staff_contact[idx].textContent)
        localStorage.setItem("staff_username", staff_username[idx].textContent)
        localStorage.setItem("staff_email", staff_email[idx].textContent)
        window.location.href = '../../html/manager/staff_edit.html'
    })
})

// API CALL to get all staff details