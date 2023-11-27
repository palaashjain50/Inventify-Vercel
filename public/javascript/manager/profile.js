const save_and_cancel_buttons = document.querySelector('.save_and_cancel_buttons')
save_and_cancel_buttons.style.cssText = 'display: none;'

var inputs = document.querySelectorAll('input')

var input_values = []
inputs.forEach(ip => {
    input_values.push(ip.value)
})

document.querySelector('.edit').addEventListener('click', () => {
    if(save_and_cancel_buttons.style.display === 'none') save_and_cancel_buttons.style.cssText = 'display: flex;'
    else save_and_cancel_buttons.style.cssText = 'display: none;'

    inputs.forEach((ip) => {
        // console.log(ip.id)
        if(ip.id !== 'role' && ip.id !== 'doj' && ip.id !== 'email') {
            ip.removeAttribute('readonly')
        } 
    })
})

document.querySelector('.cancel_opt').addEventListener('click', () => {
    save_and_cancel_buttons.style.cssText = 'display: none;'
    inputs.forEach((ip, idx) => {
        ip.value = input_values[idx]
        ip.setAttribute('readonly', true)
    })
})

document.querySelector('.save_opt').addEventListener('click', () => {
    input_values = []
    inputs.forEach(ip => {
        input_values.push(ip.value)
    })
    save_and_cancel_buttons.style.cssText = 'display: none;'

    // API CALL for updating profile in DB
    const firstName = document.querySelector('#fname').value
    const lastName = document.querySelector('#lname').value
    const contact = document.querySelector('#contact').value
    const email = document.querySelector('#email').value
    console.log(firstName, lastName, contact ,email)
    updateProfile(firstName, lastName, contact, email)
})

async function updateProfile(firstName, lastName, contact, email) {
    try {
        // console.log(contact)
        const response = await fetch('https://inventify-render.onrender.com/update-profile', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                fname: firstName,
                lname: lastName,
                contact: contact
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        })
        const data = await response.json()
        console.log(data)
        if(data.success) location.reload()
    } catch (error) {
        console.log("Error occured while updating profile")
        console.log(error)
    }
}