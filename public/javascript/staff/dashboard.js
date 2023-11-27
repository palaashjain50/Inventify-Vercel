// For all pages
var page = window.location.pathname.split("/")[1]
console.log(page)    

if(page === 'staff-dashboard') page = 'DASHBOARD'
else if(page === 'staff-profile') page = 'PROFILE'
else if(page === 'staff-products') page = 'PRODUCT'
else if(page === 'staff-orders') page = 'ORDERS'


const currPage = document.querySelector(`.${page}`)
const logoutPage = document.querySelector('.logout_page')

logoutPage.classList.add('inactive')

document.querySelector('.logout_btn').addEventListener('click', () => {
    // console.log(currPage)
    if(logoutPage.classList.contains('inactive')) {
        logoutPage.classList.remove('inactive')
        currPage.style.cssText = 'opcaity: 0.9; filter: blur(4px);'
    }
    else {
        logoutPage.classList.add('inactive')
        currPage.style.cssText = 'opcaity: 1; filter: blur(0px);'
    }
})  

document.querySelector('.cancel').addEventListener('click', () => {
    currPage.style.cssText = 'opcaity: 1; filter: blur(0px);'
    if(!logoutPage.classList.contains('inactive')) logoutPage.classList.add('inactive')
})

document.querySelector('.yes').addEventListener('click', async() => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    // console.log(document.cookie("token"))
    let response = await fetch('https://inventify-render.onrender.com/logout', {
        method: "POST"
    })
    let data = await response.json()
    if(data.success) {
        window.location.href = '/'
    }   
})



       