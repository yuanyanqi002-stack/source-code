const itemsData = [
    {
        id: 1,
        title: "Apple AirPods Pro",
        status: "lost",
        date: "2026-03-18",
        location: "Library Block A, 2nd Floor",
        description: "White AirPods Pro case inside a dark blue silicone cover. Left earpiece is missing.",
        imgSrc: "https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80&w=600",
        comments: [
            { text: "I think I saw a blue case near the copy machine!", date: "2026-03-18 14:30" }
        ]
    },
    {
        id: 2,
        title: "Blue Water Bottle",
        status: "found",
        date: "2026-03-17",
        location: "Cafeteria Table 4",
        description: "Large metal Tupperware bottle, metallic blue, has a small dent on the bottom right side.",
        imgSrc: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600",
        comments: []
    },
    {
        id: 3,
        title: "Calculus Textbook",
        status: "found",
        date: "2026-03-15",
        location: "Lecture Hall B",
        description: "Calculus Early Transcendentals 8th Edition. The name 'John D.' is written on the inner cover.",
        imgSrc: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
        comments: [
            { text: "That is mine! I will contact the IT desk.", date: "2026-03-16 09:15" }
        ]
    }
];

let currentItemId = null;
let isLoggedIn = false;
let isLoginMode = true;

document.addEventListener("DOMContentLoaded", () => {
    renderGrid();
    setupEventListeners();
});

function renderGrid() {
    const gridContainer = document.getElementById("items-grid");
    gridContainer.innerHTML = "";

    itemsData.forEach(item => {

        const card = document.createElement("div");
        card.className = "card";
        card.onclick = () => openDetailView(item.id);

        card.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}" class="img-placeholder">
            <div class="card-content">
                <span class="badge ${item.status}">${item.status.toUpperCase()}</span>
                <h3>${item.title}</h3>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

function openDetailView(id) {
    const item = itemsData.find(i => i.id === id);
    if (!item) return;

    currentItemId = id;

    document.getElementById("detail-image").src = item.imgSrc;
    document.getElementById("detail-title").textContent = item.title;

    const statusBadge = document.getElementById("detail-status");
    statusBadge.textContent = item.status.toUpperCase();
    statusBadge.className = `badge ${item.status}`;

    document.getElementById("detail-date").textContent = item.date;
    document.getElementById("detail-location").textContent = item.location;
    document.getElementById("detail-desc").textContent = item.description;

    renderComments(item.comments);

    document.getElementById("gallery-view").classList.remove("active");
    document.getElementById("gallery-view").classList.add("hidden");
    document.getElementById("detail-view").classList.remove("hidden");
    document.getElementById("detail-view").classList.add("active");
}

function renderComments(comments) {
    const commentsContainer = document.getElementById("comments-list");
    commentsContainer.innerHTML = "";

    if (comments.length === 0) {
        commentsContainer.innerHTML = "<p>No comments yet. Be the first to help!</p>";
        return;
    }

    comments.forEach(comment => {
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment-card";
        commentDiv.innerHTML = `
            <span class="comment-date"><i class="fa-regular fa-clock"></i> ${comment.date}</span>
            <p>${comment.text}</p>
        `;
        commentsContainer.appendChild(commentDiv);
    });
}

function handleAddComment() {
    const textArea = document.getElementById("new-comment-text");
    const text = textArea.value.trim();

    if (text === "" || currentItemId === null) return;

    const itemIndex = itemsData.findIndex(i => i.id === currentItemId);

    if (itemIndex > -1) {

        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        
        itemsData[itemIndex].comments.push({
            text: text,
            date: dateStr
        });

        renderComments(itemsData[itemIndex].comments);
        textArea.value = "";
    }
}

function goHome() {
    if (!isLoggedIn) {
        alert("Please log in first!");
        return;
    }
    document.getElementById("detail-view").classList.remove("active");
    document.getElementById("detail-view").classList.add("hidden");
    document.getElementById("auth-view").classList.remove("active");
    document.getElementById("auth-view").classList.add("hidden");

    const uploadView = document.getElementById("upload-view");
    if (uploadView) {
        uploadView.classList.remove("active");
        uploadView.classList.add("hidden");
    }

    document.getElementById("gallery-view").classList.remove("hidden");
    document.getElementById("gallery-view").classList.add("active");

    currentItemId = null;
}

function showUploadView() {
    if (!isLoggedIn) {
        alert("Please log in first before reporting an item!");
        return;
    }
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove("active");
        v.classList.add("hidden");
    });

    document.getElementById("upload-view").classList.remove("hidden");
    document.getElementById("upload-view").classList.add("active");
}

function handleUploadSubmit(e) {
    e.preventDefault();

    const type = document.getElementById("item-type").value;
    const title = document.getElementById("item-title").value.trim();
    const date = document.getElementById("item-date").value;
    const location = document.getElementById("item-location").value.trim();
    const desc = document.getElementById("item-desc").value.trim();
    let imgUrl = document.getElementById("item-img").value.trim();

    if (!imgUrl) {
        imgUrl = "https://images.unsplash.com/photo-1544813545-4827233fc5ce?auto=format&fit=crop&q=80&w=600";
    }

    const newItemId = itemsData.length > 0 ? Math.max(...itemsData.map(i => i.id)) + 1 : 1;

    itemsData.unshift({
        id: newItemId,
        title: title,
        status: type,
        date: date,
        location: location,
        description: desc,
        imgSrc: imgUrl,
        comments: []
    });

    renderGrid();

    document.getElementById("upload-form").reset();
    alert("Your item has been reported successfully!");
    goHome();
}

function setupEventListeners() {
    document.getElementById("btn-home").addEventListener("click", goHome);
    document.getElementById("btn-back").addEventListener("click", goHome);
    document.getElementById("btn-submit-comment").addEventListener("click", handleAddComment);
    document.getElementById("btn-add").addEventListener("click", showUploadView);

    const uploadForm = document.getElementById("upload-form");
    if (uploadForm) {
        uploadForm.addEventListener("submit", handleUploadSubmit);
    }

    const authForm = document.getElementById("auth-form");
    if (authForm) {
        authForm.addEventListener("submit", handleAuth);
    }

    const authToggle = document.getElementById("auth-toggle-link");
    if (authToggle) {
        authToggle.addEventListener("click", toggleAuthMode);
    }
}

function toggleAuthMode(e) {
    if (e) e.preventDefault();
    isLoginMode = !isLoginMode;
    const title = document.getElementById("auth-title");
    const submitBtn = document.getElementById("btn-auth-submit");
    const toggleText = document.getElementById("auth-toggle-text");
    const toggleLink = document.getElementById("auth-toggle-link");

    if (isLoginMode) {
        title.textContent = "Student Login";
        submitBtn.textContent = "Log In";
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = "Sign Up";
    } else {
        title.textContent = "Student Sign Up";
        submitBtn.textContent = "Sign Up";
        toggleText.textContent = "Already have an account?";
        toggleLink.textContent = "Log In";
    }
}

function handleAuth(e) {
    e.preventDefault();
    const emailStr = document.getElementById("student-email").value.trim();
    const passwordStr = document.getElementById("student-password").value.trim();

    if (emailStr && passwordStr) {
        if (!emailStr.includes("@")) {
            alert("Please enter a valid student email address.");
            return;
        }

        isLoggedIn = true;
        document.getElementById("auth-view").classList.remove("active");
        document.getElementById("auth-view").classList.add("hidden");
        document.getElementById("gallery-view").classList.remove("hidden");
        document.getElementById("gallery-view").classList.add("active");
    }
}
