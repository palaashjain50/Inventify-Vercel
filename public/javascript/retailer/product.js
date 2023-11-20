const product_card = document.querySelectorAll('.addToCart')

var cartItems = []

if(localStorage.getItem("cartItems")) {
    cartItemsStoredInLocalStorage = localStorage.getItem("cartItems")
    console.log(typeof cartItemsStoredInLocalStorage)
    for(let i = 0; i < cartItemsStoredInLocalStorage.length; i+=2) {
        // console.log(cartItems[i])
        cartItems.push(cartItemsStoredInLocalStorage[i])
        product_card[cartItemsStoredInLocalStorage[i] - 1].style.cssText = 'color: black; background-color: #6ee7b7;'   
        product_card[cartItemsStoredInLocalStorage[i] - 1].textContent = 'Added to Cart'
    }
}

product_card.forEach((card) => {
    card.addEventListener('click', () => {
        if(cartItems.includes(card.id)) {
            cartItems.splice(cartItems.indexOf(card.id), 1)
            card.style.cssText = 'color: #071E41; background-color: #85B6FE;'     
            card.textContent = 'Add to Cart'
        }
        else {
            cartItems.push(card.id)   
            card.style.cssText = 'color: black; background-color: #6ee7b7;'     
            card.textContent = 'Added to Cart'
        }
        localStorage.setItem("cartItems", cartItems)
    })
}) 

