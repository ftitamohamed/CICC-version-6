document.addEventListener("DOMContentLoaded", () => {
    // Helper function to display error messages in a form
    function showErrorMessage(form, message) {
        let errorElement = form.querySelector(".form-error");
        if (!errorElement) {
            errorElement = document.createElement("p");
            errorElement.className = "form-error";
            errorElement.style.color = "red";
            errorElement.style.marginTop = "10px";
            form.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    // Function to clear existing error messages
    function clearErrorMessage(form) {
        const errorElement = form.querySelector(".form-error");
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Handle UI panel toggle for login and signup
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    if (signUpButton && signInButton) {
        signUpButton.addEventListener("click", () => {
            container.classList.add("right-panel-active");
        });

        signInButton.addEventListener("click", () => {
            container.classList.remove("right-panel-active");
        });
    }

    // Handle logo click for redirection
    const logoButton = document.getElementById("home-logo");
    const logoButton1 = document.getElementById("home-logo1");

    if (logoButton) {
        logoButton.addEventListener("click", () => {
            window.location.href = "index.html"; // Replace with your home page URL
        });
    }

    if (logoButton1) {
        logoButton1.addEventListener("click", () => {
            window.location.href = "index.html"; // Replace with your home page URL
        });
    }

    // Handle login form submission
    const loginForm = document.querySelector(".sign-in-container form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearErrorMessage(loginForm); // Clear previous errors

            const email = loginForm.querySelector('input[type="email"]').value.trim();
            const password = loginForm.querySelector('input[type="password"]').value.trim();

            if (!email || !password) {
                showErrorMessage(loginForm, "الرجاء ملء جميع الحقول.");
                return;
            }

            try {
                document.getElementById("loader").style.display = "inline-block";
                const response = await fetch("https://custmize.digitalgo.net/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept-Language": "ar",
                    },
                    body: JSON.stringify({ email, password }),
                });
                document.getElementById("loader").style.display = "none";
                const data = await response.json();
                if (data.success) {
                    const { name, token,otp } = data.data;
                    localStorage.setItem("userName", name);
                    localStorage.setItem("accessToken", token);
                    localStorage.setItem("message", data.message);
                    localStorage.setItem("email", data.data.email);
                    localStorage.setItem("otp", data.data.otp);

                    console.log("User name and token saved to localStorage");
                    console.log(name, token,otp);
                    // Redirect to dashboard or home after login success (if needed)
                    window.location.href = "index.html"; // Adjust as needed
                } else {
                    showErrorMessage(loginForm, data.message || "فشل تسجيل الدخول");
                }
            } catch (error) {
                console.error("An error occurred:", error);
                showErrorMessage(loginForm, "حدث خطأ أثناء تسجيل الدخول.");
            }
        });
    }

    // Handle signup form submission
    const signUpForm = document.querySelector(".sign-up-container form");
    if (signUpForm) {
        signUpForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearErrorMessage(signUpForm); // Clear previous errors

            const name = signUpForm.querySelector('input[placeholder="إسم المستخدم"]').value.trim();
            const email = signUpForm.querySelector('input[placeholder="البريد الإلكتروني "]').value.trim();
            const password = signUpForm.querySelector('input[placeholder="كلمة السر"]').value.trim();
            const confirmPassword = signUpForm.querySelector('input[placeholder="تأكيد كلمة السر "]').value.trim();
            const phone = signUpForm.querySelector('input[placeholder="رقم الهاتف " ]').value.trim();

            if (!name || !email || !password || !confirmPassword || !phone) {
                showErrorMessage(signUpForm, "الرجاء ملء جميع الحقول.");
                return;
            }

            if (password !== confirmPassword) {
                showErrorMessage(signUpForm, "كلمتا السر غير متطابقتين.");
                return;
            }

            try {
                document.getElementById("loader").style.display = "inline-block";
                const response = await fetch("https://custmize.digitalgo.net/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept-Language": "ar",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        confirm_password: confirmPassword,
                        phone
                    }),
                });
                document.getElementById("loader").style.display = "none";
                const data = await response.json();
                
                if (data.success) {
                    console.log(data);
                    const { name, token,otp } = data.data;
                    localStorage.setItem("userName", name);
                    localStorage.setItem("accessToken", token);
                    localStorage.setItem("message", data.message);
                    localStorage.setItem("email", data.data.email);
                    localStorage.setItem("otp", data.data.otp);

                    console.log("User name and token saved to localStorage");
                    console.log(name, token,otp);
                    /* showOTPDialog(data.message, data.data.email); */
                    window.location.href = "index.html";
                    
                } else {
                    showErrorMessage(signUpForm, data.message || "فشل إنشاء الحساب");
                }
            } catch (error) {
                console.error("An error occurred:", error);
                showErrorMessage(signUpForm, "حدث خطأ أثناء إنشاء الحساب.");
            }
        });
    }

    // Function to show the OTP dialog
    function showOTPDialog(message, email) {
        // Create the OTP popup HTML
        const otpPopupHTML = `
            <div class="otp-popup">
                <div class="otp-popup-content">
                    <h2>تم إنشاء الحساب بنجاح</h2>
                    <p>${message}</p>
                    <p>يرجى إدخال رمز التفعيل المرسل إلى بريدك الإلكتروني.</p>
                    <input type="text" id="otp-input" placeholder="أدخل رمز التفعيل" />
                    <button id="submit-otp">تأكيد الرمز</button>
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
                alert("انتهى الوقت! الرجاء المحاولة مرة أخرى.");
            }
            timer--;
        }, 1000);

        // Handle OTP submission
        document.getElementById("submit-otp").addEventListener("click", async () => {
            const otp = document.getElementById("otp-input").value.trim();
            if (!otp) {
                alert("الرجاء إدخال رمز التفعيل.");
                return;
            }

            try {
                
                const otpResponse = await fetch("https://custmize.digitalgo.net/api/verify_otp", {
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
                console.log(otpResponse);
                if (otpResponse.ok) {
                    const otpData = await otpResponse.json();
                    console.log(otpData);
                    alert("تم تفعيل الحساب بنجاح!");
                   
                    window.location.href = "index.html"; // Redirect to homepage or dashboard
                } else {
                    const otpError = await otpResponse.text();
                    alert("فشل تأكيد الرمز: " + otpError);
                }
            } catch (error) {
                alert("حدث خطأ أثناء تأكيد الرمز.");
            }
        });
    }
});
