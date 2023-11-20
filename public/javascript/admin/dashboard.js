const logoutPage = document.querySelector('.logout_page')

logoutPage.classList.add('inactive')

document.querySelector('.logout_btn').addEventListener('click', () => {
    if(logoutPage.classList.contains('inactive')) logoutPage.classList.remove('inactive')
    else logoutPage.classList.add('inactive')
})  

document.querySelector('.cancel').addEventListener('click', () => {
    if(!logoutPage.classList.contains('inactive')) logoutPage.classList.add('inactive')
})

document.querySelector('.yes').addEventListener('click', () => {
    window.location.href = '../../html/visitors/homepage.html'
})

// const lightblue = "#96B9FF"
// const darkblue = "#071E41"
// const white = "#fff"

// const navTitle = document.querySelectorAll('.nav_title')
// navTitle[0].style.backgroundColor = `${white}`
