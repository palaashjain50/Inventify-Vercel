console.log("otp page")

var credentials = localStorage.getItem("credentials")
if(credentials) {
    console.log(credentials)
    credentials = JSON.parse(credentials)
}
// console.log(credentials.email)

const inputs = document.querySelectorAll("input")
const button = document.querySelector("button");

// iterate over all inputs
inputs.forEach((input, index1) => {
input.addEventListener("keyup", (e) => {
  // This code gets the current input element and stores it in the currentInput variable
  // This code gets the next sibling element of the current input element and stores it in the nextInput variable
  // This code gets the previous sibling element of the current input element and stores it in the prevInput variable
  const currentInput = input,
    nextInput = input.nextElementSibling,
    prevInput = input.previousElementSibling;

  // if the value has more than one character then clear it
  if (currentInput.value.length > 1) {
    currentInput.value = "";
    return;
  }
  // if the next input is disabled and the current value is not empty
  //  enable the next input and focus on it
  if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
    nextInput.removeAttribute("disabled");
    nextInput.focus();
  }

  // if the backspace key is pressed
  if (e.key === "Backspace") {
    // iterate over all inputs again
    inputs.forEach((input, index2) => {
      // if the index1 of the current input is less than or equal to the index2 of the input in the outer loop
      // and the previous element exists, set the disabled attribute on the input and focus on the previous element
      if (index1 <= index2 && prevInput) {
        input.setAttribute("disabled", true);
        input.value = "";
        prevInput.focus();
      }
    });
  }
  //if the fourth input( which index number is 5) is not empty and has not disable attribute then
  //add active class if not then remove the active class.
  if (!inputs[5].disabled && inputs[5].value !== "") {
    button.classList.add("active");
    return;
  }
  button.classList.remove("active");
});
});

//focus the first input which index is 0 on window load
window.addEventListener("load", () => inputs[0].focus());

button.addEventListener('click', async(E) => {
    E.preventDefault()
    var enteredOTP = ""
    if(button.classList.contains("active")) {
        inputs.forEach((input) => {
            enteredOTP += (input.value)
        })
  
        credentials.otp = enteredOTP
        console.log(credentials)

        const response = await fetch("https://inventify-render.onrender.com/signup", {
            method: "POST",
            body: JSON.stringify({credentials
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        console.log(response);
        const data = await response.json()
        console.log(data)
        if(data.success) {
          localStorage.removeItem("credentials")
          window.location.href = '/login'
        }
    }
})

function startTimer() {
  let count = 59;
  const time = document.querySelector('.timer');
  const resendBtn = document.querySelector('.resend');
  const timer = setInterval(function() {
    count--;
    if (count < 10) time.textContent = `00:0${count}`;
    else time.textContent = `00:${count}`;
    if (count === 0) {
      clearInterval(timer);
      resendBtn.style.cssText = 'font-weight: bold; cursor: pointer; transition-duration: 0.5s;';
    }
  }, 1000);
}

// Set up the event listener outside the timer function
const resendBtn = document.querySelector('.resend');
resendBtn.addEventListener('click', async () => {
  const response = await fetch("https://inventify-render.onrender.com/get-otp", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  console.log(response);
  const data = await response.json();
  if(data.success) {
    startTimer();
  }
});

// Start the timer initially
startTimer();

