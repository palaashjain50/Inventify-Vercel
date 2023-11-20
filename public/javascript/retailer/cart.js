var cartItems = []

if(localStorage.getItem("cartItems")) {
    cartItemsStoredInLocalStorage = localStorage.getItem("cartItems")
    // console.log(typeof cartItemsStoredInLocalStorage)
    for(let i = 0; i < cartItemsStoredInLocalStorage.length; i += 2) {
        cartItems.push(cartItemsStoredInLocalStorage[i])
    }
    getCartItems(cartItems);
}
else {
    // display img of empty cart
    console.log("Empty Cart :(")
    const card = document.querySelector('.card')
    const emptyCartImg = document.createElement('img')
    emptyCartImg.src = '../images/empty.png'
    emptyCartImg.style.height = '500px'
    emptyCartImg.style.width = '500px'

    var productListInViewSummary = document.querySelector('.product-list')
    let productItemInViewSummary = document.createElement('div')
    productItemInViewSummary.innerHTML += `
        <div>
            <h1>Empty Cart</h1>
        </div>
    `
    console.log(productItemInViewSummary)
    productListInViewSummary.appendChild(productItemInViewSummary)

    var cartAmount = document.querySelector('.cartAmount')
    cartAmount.textContent = '--'

    var toPayAmount = document.querySelector('.toPayAmount')
    toPayAmount.textContent = '--'

    card.appendChild(emptyCartImg)

}

async function getCartItems(cartItems) {
    try {
        let username = localStorage.getItem("username")
        let response = await fetch(`http://localhost:5500/get-cart-items/${username}`, {
            method: 'POST',
            body: JSON.stringify({
                cart: cartItems
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        let data = await response.json()
        if(data.success) {
                if(document.querySelectorAll('.cardItem')) {
                    const cardItem = document.querySelectorAll('.cardItem')
                    cardItem.forEach(card => {
                        card.remove()
                    })
                    const productItemInViewSummary = document.querySelectorAll('.gridClass')
                    productItemInViewSummary.forEach(item => {
                        item.remove()
                    })
                }
                console.log(data.data)
                data = data.data
                if(data.length === 0) {
                    const card = document.querySelector('.card')
                    const emptyCartImg = document.createElement('img')
                    emptyCartImg.src = '../images/empty.png'
                    emptyCartImg.style.height = '500px'
                    emptyCartImg.style.width = '500px'
                    card.appendChild(emptyCartImg)
                }
                // data = data[0]
                // console.log(data[1][0])
                let cartProducts = document.createElement('div')
                for(let i = 0; i < data.length; i++) {
                    // console.log(data[i][0].image)
                    cartProducts.innerHTML += `
                    <div class="cardItem flex gap-5 w-[100%] px-5 py-3 rounded-[10px] min-h-[80px] mb-[20px]">
                        <img src=${data[i][0].image} alt="${data[i][0].id}" width="80px" height="50px">
                        <div class="flex flex-col justify-evenly w-[300px] ">
                            <p class="text-[20px] font-semibold tracking-widest ">
                                ${data[i][0].name}
                            </p>
                            <p class="tracking-wide">
                            ${data[i][0].category}</p>
                        </div>
                        <div class="w-[350px] gap-[20px] text-[18px] font-normal flex flex-col justify-evenly">
                            <p>
                                ${data[i][0].description}
                            </p>
                            <div class="flex gap-5 items-center font-normal">
                                <button class="plus bg-[#071E41] text-white w-[25px] height-[25px] rounded-full hover:bg-[#7CA7FB] transition-all duration-200">+</button>
                                <p class="qty text-[15px] font-bold">1</p>
                                <button class="minus bg-[#071E41] text-white w-[25px] height-[25px] rounded-full hover:bg-[#7CA7FB] transition-all duration-200">-</button>
                            </div>
                        </div>
                    </div>
                    `
                }
                
                const card = document.querySelector('.card')
                card.appendChild(cartProducts)

                // ----------------------------------------------------------------

                var productListInViewSummary = document.querySelector('.product-list')
                let productItemInViewSummary = document.createElement('div')
                var totalPriceofProduct = 0
                for(let i = 0; i < data.length; ++i) {
                    productItemInViewSummary.innerHTML += `
                    <div class="gridClass">
                        <h1 class="pn" id="${data[i][0].id}">${data[i][0].name}</h1>
                        <p>
                            &#8377; <span class="unitPrice">${data[i][0].unitprice}</span> X 
                            <span>12 (<span> <span class="qtyStrip">1</span> strip</span>)</span>
                        </p>
                    </div>
                    `
                    totalPriceofProduct += data[i][0].unitprice * 12
                }
                productListInViewSummary.appendChild(productItemInViewSummary)

                const cardItem = document.querySelectorAll('.cardItem')
                const qty = document.querySelectorAll('.qty')
                const plus = document.querySelectorAll('.plus')
                const qtyStrip = document.querySelectorAll('.qtyStrip')
                const unitPrice = document.querySelectorAll('.unitPrice')

                var cartAmount = document.querySelector('.cartAmount')
                cartAmount.textContent = totalPriceofProduct

                var toPayAmount = document.querySelector('.toPayAmount')
                toPayAmount.textContent = totalPriceofProduct + 100

                plus.forEach((p, idx) => {
                    p.addEventListener('click', () => {
                        qty[idx].textContent = parseInt(qty[idx].textContent) + 1
                        qtyStrip[idx].textContent = parseInt(qtyStrip[idx].textContent) + 1
                        cartAmount.textContent = parseFloat(cartAmount.textContent) + parseFloat(unitPrice[idx].textContent) * 12
                        toPayAmount.textContent = 100 + parseFloat(cartAmount.textContent)
                        // console.log('clicked on plus ', idx)
                    })
                })

                const minus = document.querySelectorAll('.minus')
                minus.forEach((p, idx) => {
                    p.addEventListener('click', () => {
                        if(qty[idx].textContent === '1') {
                            cartItems.splice(idx, 1)
                            localStorage.setItem('cartItems', cartItems)
                            getCartItems(cartItems)
                        }
                        else {
                            qty[idx].textContent = parseInt(qty[idx].textContent) - 1
                            qtyStrip[idx].textContent = parseInt(qtyStrip[idx].textContent) - 1
                            cartAmount.textContent = parseFloat(cartAmount.textContent) - parseFloat(unitPrice[idx].textContent) * 12
                            toPayAmount.textContent = parseFloat(cartAmount.textContent) + 100
                        }
                        // console.log('clicked on minus ', idx)
                    })
                })

        }

        // console.log(data)
    } catch (error) {
        console.log(error)
    }
}



document.querySelector('.confirm-order').addEventListener('click', () => {
    if(localStorage.getItem("cartItems")) {
        var product = []

        const subheader = document.querySelector('.subheader')
        const cartItems = document.querySelector('.cartItems')
        const summaryContainer = document.querySelector('.summary-container')
        
        const productName = document.querySelectorAll('.pn')
        const unitPrice = document.querySelectorAll('.unitPrice')
        const qtyStrip = document.querySelectorAll('.qtyStrip')

        var cartAmount = document.querySelector('.cartAmount')
        var toPayAmount = document.querySelector('.toPayAmount')
        
        for(let i = 0; i < productName.length; ++i) {
            product.push({
                productID: productName[i].id,
                productName: productName[i].textContent,
                unitPrice: unitPrice[i].textContent,
                qtyStrip: qtyStrip[i].textContent
            })
        }
        console.log(product)

        cartItems.classList.add('inactive')
        summaryContainer.classList.add('inactive')
        subheader.classList.add('inactive')

        const orderForm = document.querySelector('.order-form')
        orderForm.classList.remove("inactive") 



        const confirmOrder2 = document.querySelector('.confirmOrder2')
        confirmOrder2.addEventListener('click', async(e) => {
            // const fname = document.querySelector('#fname').value
            // const lname = document.querySelector('#lname').value
            // const contact = document.querySelector('#contact').value
            // const email = document.querySelector('#email').value
            // const address = document.querySelector('#address').value
            // const address2= document.querySelector('#address2').value
            // const city = document.querySelector('#city').value
            // const zip = document.querySelector('#zip').value

            e.preventDefault()

            const fname = "Harsh"
            const lname = "Jain"
            const contact = "564545454"
            const email = "ajdajsd@gmail.com"
            const address = "address1"
            const address2 = "address2"
            const city = "thane"
            const zip = "40104"

            const username = localStorage.getItem("username")
            let response = await fetch(`http://localhost:5500/order-items/${username}`, {
                method: "POST",
                body: JSON.stringify(
                    {
                        fname: fname,
                        lname: lname,
                        contact: contact,
                        email: email,
                        address: address,
                        address2: address2,
                        city: city,
                        zip: zip,
                        products: product,
                        productAmount: cartAmount.textContent,
                        shippingFee: 100,
                        totalAmount: toPayAmount.textContent,
                    }
                ),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
            let data = await response.json()
            console.log(data)
            if(data.success === true) {
                window.location.href = `/retailer-orders/${localStorage.getItem("username")}`
            }
        })
    }
})



