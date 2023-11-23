const discardBtn = document.querySelectorAll('#discard-btn')
const sendApprovalBtn = document.querySelectorAll('#send-approval-btn')
const orderStatus = document.querySelectorAll('#orderStatus')
const transactionID = document.querySelectorAll('#transactionID')

discardBtn.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        console.log('Click', orderStatus[idx].textContent.trim() ,idx)
        if(orderStatus[idx].textContent.trim() === 'Pending') {
            orderStatus[idx].textContent = 'Cancelled'
            btn.style.cssText = "background-color: #94a3b8"
            sendApprovalBtn[idx].style.cssText = "background-color: #94a3b8"
            // btn.remove()
            // sendApprovalBtn[idx].remove()s
            updateStatus(transactionID[idx].textContent.trim(), 'Cancelled');
        }
    })
})

sendApprovalBtn.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        console.log('Click', orderStatus[idx].textContent.trim() ,idx)
        if(orderStatus[idx].textContent.trim() === 'Pending') {
            orderStatus[idx].textContent = 'Cancelled'
            btn.style.cssText = "background-color: #94a3b8"
            discardBtn[idx].style.cssText = "background-color: #94a3b8"
            // btn.remove()
            // sendApprovalBtn[idx].remove()s
            updateStatus(transactionID[idx].textContent.trim(), 'In Approval');
        }
    })
})


async function updateStatus(id, status) {
    try {
        console.log(id, status)
        const staff_username = localStorage.getItem("username")
        const response = await fetch(`https://inventify-render.onrender.com/update-product-status/${staff_username}`  , {
            method: 'POST', 
            body: JSON.stringify({
                transactionID: id,
                status: status,
                staff_username: staff_username
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        console.log(response)
        // const data = await response.json()
        // console.log(data)
    } catch (error) {
        console.log("Error while updating status of product")
        console.log(error)
    }
}
