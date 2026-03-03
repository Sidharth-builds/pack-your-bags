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

// Wait until page loads
document.addEventListener("DOMContentLoaded", () => {

    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location = "login.html";
        }
    });

    firebase.auth().onAuthStateChanged(async (user) => {

        const profileBox = document.querySelector(".profile-box");
        const profileName = document.querySelector(".profile-name");

        if (!profileBox || !profileName) return;

        if (user) {

            // Get user data from Firestore
            const doc = await firebase.firestore()
                .collection("users")
                .doc(user.uid)
                .get();

            if (doc.exists) {

                const data = doc.data();

                // Show username
                profileName.innerText = "Hello, " + data.username;

            }

            // Change menu options
            if (!profileBox.querySelector(".logout-link")) {
                profileBox.innerHTML += `
                <a href="#" class="logout-link" onclick="logout()">Logout</a>
            `;
            }

        }
        else {

            profileName.innerText = "Hello, Traveler";
            const logoutLink = profileBox.querySelector(".logout-link");
            if (logoutLink) {
                logoutLink.remove();
            }

        }

    });

});


function logout() {

    firebase.auth().signOut()
        .then(() => {

            alert("Logged out");

            window.location = "login.html";

        });

}

window.logout = logout;
