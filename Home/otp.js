let message = localStorage.getItem('message') || "";
let email = localStorage.getItem('email') || "";
let verified ;
async function getUserProfile() {
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch('https://dashboard.caduksa.com/api/myprofile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('the profile data is ',data);
        
        // Check if otp is null, then hide the OTP button
        if (data.success && data.data.otp !== null) {
            document.querySelector('.otpButton').style.display = 'block';
            showOTPDialog(data.message, email);
        }
    
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}
getUserProfile()
function showOTPDialog(message, email) {
    // Create the OTP popup HTML
    const otpPopupHTML = `
        <div class="otp-popup">
            <span class="close">X</span>
            <div class="otp-popup-content">
                <h2>Account created successfully</h2>
                <p>${message}</p>
                <p>Please enter the OTP code sent to your email.</p>
                <input type="text" id="otp-input" placeholder="Enter the OTP code." />
                <button id="submit-otp">Verify OTP</button>
                <div id="timer">01:30</div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", otpPopupHTML);

    // Start the countdown timer for OTP
    let timer = 90; // 1 minute 30 seconds
    const timerDiv = document.getElementById("timer");
    const countdown = setInterval(() => {
        const minutes = Math.floor(timer / 60).toString().padStart(2, "0");
        const seconds = (timer % 60).toString().padStart(2, "0");
        timerDiv.textContent = `${minutes}:${seconds}`;
        if (timer === 0) {
            clearInterval(countdown);
            alert("Time's up! Please try again.");
            removeOTPPopup();
        }
        timer--;
    }, 1000);

    // Handle closing the popup
    const close = document.querySelector('.close');
    close.addEventListener('click', removeOTPPopup);

    // Handle OTP submission
    document.getElementById("submit-otp").addEventListener("click", async () => {
        const otp = document.getElementById("otp-input").value.trim();
        if (!otp) {
            alert("Please enter the OTP code.");
            return;
        }

        try {
            const otpResponse = await fetch("https://dashboard.caduksa.com/api/verify_otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": "ar",
                },
                body: JSON.stringify({
                    otp,
                    email: email,
                }),
            });
            const otpData = await otpResponse.json();
            console.log('data:',otpData,'response:',otpResponse);
            if (otpData.success) {

                
                console.log('data:',otpData,'response:',otpResponse);
                alert("The account has been successfully activated!");
                // Hide the button and close the popup
                document.querySelector('.otpButton').style.display = "none";
                removeOTPPopup();
                 // Redirect to homepage or dashboard
            } else {
                /* const otpError = await otpResponse.text(); */
                alert("Code confirmation failed: " + otpData.message);
            }
        } catch (error) {
            alert("Code confirmation failed: " );
        }
    });

    // Function to remove the OTP popup
    function removeOTPPopup() {
        const otpPopup = document.querySelector('.otp-popup');
        if (otpPopup) {
            otpPopup.remove();
            clearInterval(countdown); // Stop the timer
        }
    }
}
let clickOtp = localStorage.getItem('clickOtp');

console.log(verified,'clicking on the otp');