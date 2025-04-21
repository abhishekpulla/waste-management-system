// ✅ Function to send OTP (with countdown timer)
async function sendOTP() {
    const email = document.getElementById("email").value.trim();
    const otpButton = document.getElementById("otpButton");
    const otpInput = document.getElementById("otp");

    if (!email) {
        alert("⚠️ Please enter your email.");
        return;
    }

    otpButton.disabled = true; // Disable button to prevent spam clicks
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
            otpInput.disabled = false; // Enable OTP field
            startOTPTimer(30, otpButton); // Start countdown timer
        } else {
            throw new Error(data.error || "❌ Error sending OTP. Try again.");
        }
    } catch (error) {
        alert(error.message);
        otpButton.disabled = false;
        otpButton.innerText = "Send OTP";
    }
}

// ✅ Function to start a 30-second countdown timer for OTP resend
function startOTPTimer(duration, otpButton) {
    let timer = duration;
    otpButton.innerText = `Resend OTP in ${timer}s`;
    const interval = setInterval(() => {
        timer--;
        otpButton.innerText = `Resend OTP in ${timer}s`;
        if (timer <= 0) {
            clearInterval(interval);
            otpButton.innerText = "Resend OTP";
            otpButton.disabled = false;
        }
    }, 1000);
}

// ✅ Enable "Sign Up" button only when OTP is entered
function enableSignupButton() {
    const otp = document.getElementById("otp").value.trim();
    document.getElementById("signupButton").disabled = otp.length === 0;
}

// ✅ Function to handle signup
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

        const data = await response.json();
        if (data.success) {
            alert("✅ Signup successful! Redirecting to login...");
            window.location.href = "index.html"; // Redirect to login page
        } else {
            throw new Error(data.error || "❌ Signup failed. Please try again.");
        }
    } catch (error) {
        alert(error.message);
    }

    signupButton.disabled = false;
    signupButton.innerText = "Sign Up";
}

// ✅ Function to toggle between login and signup forms
function showSignup() {
    document.getElementById("signup-container").style.display = "block";
    document.getElementById("login-container").style.display = "none";
}

function showLogin() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("login-container").style.display = "block";
}
