// For all pages
var page = window.location.pathname.split("/")[1]
console.log(page)    

if(page === 'manager-dashboard') page = 'DASHBOARD'
else if(page === 'manager-profile') page = 'PROFILE'
else if(page === 'manager-products') page = 'PRODUCT'

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
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    // console.log(document.cookie("token"))
    let response = await fetch('http://localhost:5500/logout', {
        method: "POST"
    })
    let data = await response.json()
    if(data.success) {
        window.location.href = '/'
    }  
})

// // --------------------------------------------------------------------------------------------

// // For active navItem in sidebar 

// const lightblue = "#96B9FF"
// const darkblue = "#071E41"
// const white = "#fff"

// const nav_item = document.querySelectorAll('.nav_item')
// const nav_title = document.querySelectorAll('.nav_title')
// // console.log(nav_title[0].textContent)
// page = page.toLowerCase()

// for(var i = 0; i < 8; i++) {
//     var title = nav_title[i].textContent.toLowerCase()
//     title = title.split(" ")[0];
//     if(title == page){
//         nav_title[i].style.cssText = "color: darkblue; font-weight: bold;";
//         nav_item[i].style.backgroundColor = `${white}`
//     }
//     else if(title != page) {
//         nav_title[i].style.cssText = `color: ${white};`;
//         nav_item[i].style.backgroundColor = `${darkblue}`
//     } 
// }


       