const apiBaseUrl = window.location.origin === 'null' ? 'http://localhost:3000' : window.location.origin;

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            alert(data.error || data.message || "Login failed");
            return;
        }

        // Save user + token
        localStorage.setItem("vetpassToken", data.token);
        localStorage.setItem("vetpassUser", data.user.name);

        // Redirect to dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        console.log(error);
        alert("Server error");
    }
});