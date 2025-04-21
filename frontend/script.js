// ✅ Toggle Password Visibility (For Multiple Fields)
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

// ✅ Enable "Sign Up" button only when OTP is entered
function enableSignupButton() {
    const otp = document.getElementById("otp").value.trim();
    document.getElementById("signupButton").disabled = otp.length === 0;
}

// ✅ LOGIN FUNCTION
async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const loginButton = document.getElementById("loginButton");
    const errorMessage = document.getElementById("error-message"); // For UI feedback

    // Clear previous error messages
    errorMessage.textContent = "";

    if (!email || !password) {
        errorMessage.textContent = "⚠️ Please fill in all fields.";
        return;
    }

    loginButton.disabled = true;
    loginButton.innerText = "Logging in...";

    try {
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "❌ Invalid credentials!");
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem("token", data.token);
            errorMessage.style.color = "green"; // Indicate success
            errorMessage.textContent = "✅ Login Successful! Redirecting...";
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000); // Redirect after delay
        } else {
            throw new Error("❌ Login failed. Please try again.");
        }
    } catch (error) {
        errorMessage.textContent = error.message;
    }

    loginButton.disabled = false;
    loginButton.innerText = "Login";
}


// ✅ SEND OTP FUNCTION (With 30s Cooldown)
async function sendOTP() {
    const email = document.getElementById("email").value.trim();
    const otpButton = document.getElementById("otpButton");

    if (!email) {
        alert("⚠️ Please enter your email.");
        return;
    }

    otpButton.disabled = true;
    otpButton.innerText = "Sending...";

    try {
        const response = await fetch("http://localhost:5000/api/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (data.success) {
            alert(`✅ OTP sent to ${email}.`);
            document.getElementById("otp").disabled = false;
            otpButton.innerText = "Resend OTP";
            setTimeout(() => otpButton.disabled = false, 30000); // Cooldown of 30 sec
        } else {
            throw new Error(data.error || "❌ Error sending OTP. Try again.");
        }
    } catch (error) {
        alert(error.message);
        otpButton.innerText = "Send OTP";
    }
}

// ✅ SIGNUP FUNCTION (With Improved Error Handling)
async function signup() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const otp = document.getElementById("otp").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const signupButton = document.getElementById("signupButton");

    if (!firstName || !lastName || !email || !otp || !password || !confirmPassword) {
        alert("⚠️ All fields are required.");
        return;
    }

    if (password.length < 6) {
        alert("⚠️ Password must be at least 6 characters.");
        return;
    }

    if (password !== confirmPassword) {
        alert("⚠️ Passwords do not match.");
        return;
    }

    signupButton.disabled = true;
    signupButton.innerText = "Signing up...";

    try {
        const response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, otp, password, confirmPassword })
        });

        if (!response.ok) throw new Error("❌ Signup failed. Check your details.");

        const data = await response.json();
        if (data.success) {
            alert("✅ Signup successful! Redirecting to login...");
            window.location.href = "index.html";
        } else {
            throw new Error(data.error || "❌ Signup failed. Try again.");
        }
    } catch (error) {
        alert(error.message);
    }

    signupButton.disabled = false;
    signupButton.innerText = "Sign Up";
}
