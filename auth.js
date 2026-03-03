const firebaseConfig = {
    apiKey: "AIzaSyC7_krXATCW91cmPqU5KR7vJeh06tBrWC4",
    authDomain: "pack-your-bags-1b792.firebaseapp.com",
    projectId: "pack-your-bags-1b792",
    storageBucket: "pack-your-bags-1b792.firebasestorage.app",
    messagingSenderId: "53412840389",
    appId: "1:53412840389:web:57606d280c3a1a23c901ac"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
}

function isOfflineError(error) {
    const code = error && error.code ? String(error.code) : "";
    const message = error && error.message ? String(error.message).toLowerCase() : "";
    return code.includes("unavailable") || message.includes("client is offline");
}

function requireOnline() {
    if (!navigator.onLine) {
        alert("You are offline. Please connect to the internet and try again.");
        return false;
    }
    return true;
}

async function resolveEmailForLogin(identifier) {
    if (identifier.includes("@")) {
        return identifier;
    }

    const usernameDoc = await db.collection("usernames").doc(identifier.toLowerCase()).get();
    if (!usernameDoc.exists) {
        throw new Error("Username not found.");
    }

    return usernameDoc.data().email;
}

async function usernameExists(username) {
    const usernameDoc = await db.collection("usernames").doc(username.toLowerCase()).get();
    return usernameDoc.exists;
}

async function signup() {
    if (!requireOnline()) {
        return;
    }

    const fullName = getValue("signup_name");
    const username = getValue("signup_username");
    const email = getValue("signup_email");
    const password = getValue("signup_password");
    const confirmPassword = getValue("signup_confirm_password");

    if (!fullName || !username || !email || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        if (await usernameExists(username)) {
            alert("Username already taken. Please choose another one.");
            return;
        }

        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: username });

        await db.collection("users").doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            fullName,
            username,
            usernameLower: username.toLowerCase(),
            email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await db.collection("usernames").doc(username.toLowerCase()).set({
            uid: userCredential.user.uid,
            username,
            usernameLower: username.toLowerCase(),
            email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Keep flow explicit: user must log in after signup.
        await auth.signOut();
        alert("Signup successful");
        window.location = "login.html";
    } catch (error) {
        if (isOfflineError(error)) {
            alert("Cannot reach Firebase right now. Check internet and try again.");
            return;
        }
        alert(error.message || "Signup failed.");
        console.error(error);
    }
}

async function login() {
    if (!requireOnline()) {
        return;
    }

    const identifier = getValue("login_identifier").toLowerCase();
    const password = getValue("login_password");

    if (!identifier || !password) {
        alert("Please enter username/email and password.");
        return;
    }

    try {
        const email = await resolveEmailForLogin(identifier);
        await auth.signInWithEmailAndPassword(email, password);
        alert("Login successful");
        window.location = "index.html";
    } catch (error) {
        if (isOfflineError(error)) {
            alert("Cannot reach Firebase right now. Check internet and try again.");
            return;
        }
        alert(error.message || "Login failed.");
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            signup();
        });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            login();
        });
    }
});

