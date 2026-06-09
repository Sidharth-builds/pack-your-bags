const firebaseConfig = {
    apiKey: "AIzaSyC7_krXATCW91cmPqU5KR7vJeh06tBrWC4",
    authDomain: "pack-your-bags-1b792.firebaseapp.com",
    projectId: "pack-your-bags-1b792",
    storageBucket: "pack-your-bags-1b792.appspot.com",
    messagingSenderId: "53412840389",
    appId: "1:53412840389:web:57606d280c3a1a23c901ac"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

function logout() {
    firebase.auth().signOut().then(() => {
        alert("Logged out");
        window.location = "login.html";
    });
}

window.logout = logout;

document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById("profile-btn");
    const profilePopup = document.getElementById("profile-popup");
    const profileBox = document.querySelector(".profile-box");
    const profileName = document.querySelector(".profile-name");
    const searchBtn = document.getElementById("search-btn");

    if (profileBtn && profilePopup) {
        profileBtn.addEventListener("click", () => {
            profilePopup.classList.toggle("active");
        });

        document.addEventListener("click", (event) => {
            if (!profilePopup.contains(event.target) && !profileBtn.contains(event.target)) {
                profilePopup.classList.remove("active");
            }
        });

        searchBtn?.addEventListener("click", () => {
            profilePopup.classList.remove("active");
        });

        window.addEventListener("scroll", () => {
            profilePopup.classList.remove("active");
        });
    }

    firebase.auth().onAuthStateChanged(async (user) => {
        if (!profileBox || !profileName) return;

        if (user) {
            const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
            if (userDoc.exists) {
                const data = userDoc.data();
                profileName.innerText = "Hello, " + data.username;
            } else {
                profileName.innerText = "Hello, Traveler";
            }

            if (!profileBox.querySelector(".logout-link")) {
                profileBox.innerHTML += '<a href="#" class="logout-link" onclick="logout()">Logout</a>';
            }
        } else {
            profileName.innerText = "Hello, Traveler";
            const logoutLink = profileBox.querySelector(".logout-link");
            if (logoutLink) {
                logoutLink.remove();
            }
        }
    });
});
