document.addEventListener("DOMContentLoaded", function () {
    // ✅ Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
        alert("⚠️ You must log in first!");
        window.location.href = "index.html";
        return;
    }

    // ✅ User Stories (Features)
    const features = [
        { title: "🛡️ User Authentication", status: "In Progress", description: "Secure login and account management." },
        { title: "🚛 Collection Scheduling", status: "To Do", description: "Schedule and track waste pickups." },
        { title: "📍 Disposal Location", status: "To Do", description: "Find nearby waste disposal centers." },
        { title: "♻️ Sorting Guidance", status: "Backlog", description: "Learn how to separate waste correctly." },
        { title: "🔔 Pickup Reminder", status: "To Do", description: "Receive notifications before waste pickup." },
        { title: "📊 Waste Tracking", status: "To Do", description: "Monitor your waste disposal progress." },
        { title: "🗑️ Waste Type Identification", status: "To Do", description: "Check if an item is recyclable." },
        { title: "📚 Educational Resources", status: "Backlog", description: "Articles and videos on waste reduction." },
        { title: "🌍 Community Recycling Events", status: "To Do", description: "Find and join local recycling programs." },
        { title: "📢 Collection Feedback", status: "To Do", description: "Submit feedback on waste collection services." }
    ];

    const featureList = document.getElementById("feature-list");

    // ✅ Display user stories dynamically
    features.forEach(feature => {
        const featureCard = document.createElement("div");
        featureCard.classList.add("feature-card");

        featureCard.innerHTML = `
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
            <span class="status ${feature.status.toLowerCase()}">${feature.status}</span>
        `;

        featureList.appendChild(featureCard);
    });

    // ✅ Logout function
    document.getElementById("logoutButton").addEventListener("click", function () {
        localStorage.removeItem("token");
        alert("✅ Logged out successfully!");
        window.location.href = "index.html";
    });
});
