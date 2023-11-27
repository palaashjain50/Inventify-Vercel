const approvalBtn = document.querySelectorAll('#approval-btn')
const discardBtn = document.querySelectorAll('#discard-btn')
const orderStatus = document.querySelectorAll('#orderStatus')
const transactionID = document.querySelectorAll('#transactionID')

approvalBtn.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        if(orderStatus[idx].textContent.trim() === 'In Approval') {
            orderStatus[idx].textContent = 'Approved'
            btn.style.cssText = "background-color: #94a3b8"
            discardBtn[idx].style.cssText = "background-color: #94a3b8"
            updateStatus(transactionID[idx].textContent.trim(), 'Approved');
        }
    })
})

async function updateStatus(id, status) {
    try {
        const username = localStorage.getItem("username")
        const response = await fetch(`https://inventify-render.onrender.com/update-approval-status/${username}`  , {
            method: 'POST', 
            body: JSON.stringify({
                transactionID: id,
                status: status,
                username: username
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        console.log(response)
    } catch (error) {
        console.log("Error while updating status of product")
        console.log(error)
    }
}